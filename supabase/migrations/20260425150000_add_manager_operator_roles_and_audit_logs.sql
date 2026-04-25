/*
  # Backoffice RBAC v2 — 3 rôles + journal d'audit

  Changements :
  1. Mise à jour de la contrainte `role` sur la table `users`
     - Anciens rôles : administrator | editor | contributor
     - Nouveaux rôles : administrator | manager | operator
  2. Migration des données existantes
     - editor      → manager
     - contributor → operator
  3. Politiques RLS ouvertes en anon pour la table `users`
     (le projet n'utilise pas Supabase Auth — auth gérée côté client)
  4. Création de la table `audit_logs`
     - Trace toutes les actions critiques du backoffice
     - Politiques anon INSERT + SELECT
*/

-- ─── 1. Mise à jour contrainte role ──────────────────────────────────────────
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('administrator', 'manager', 'operator'));

-- ─── 2. Migration des rôles existants ────────────────────────────────────────
UPDATE users SET role = 'manager'  WHERE role = 'editor';
UPDATE users SET role = 'operator' WHERE role = 'contributor';

-- ─── 3. RLS sur users — accès anon pour l'auth client-side ───────────────────
DROP POLICY IF EXISTS "Admins can view all users"       ON users;
DROP POLICY IF EXISTS "Admins can insert users"         ON users;
DROP POLICY IF EXISTS "Admins can update all users"     ON users;
DROP POLICY IF EXISTS "Admins can delete users"         ON users;
DROP POLICY IF EXISTS "anon_select_users"               ON users;
DROP POLICY IF EXISTS "anon_insert_users"               ON users;
DROP POLICY IF EXISTS "anon_update_users"               ON users;
DROP POLICY IF EXISTS "anon_delete_users"               ON users;

CREATE POLICY "anon_select_users"
  ON users FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_users"
  ON users FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_users"
  ON users FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_users"
  ON users FOR DELETE TO anon USING (true);

-- ─── 4. Table audit_logs ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid,                                      -- null si user supprimé
  user_email   text        NOT NULL,
  user_name    text        NOT NULL,
  user_role    text        NOT NULL,
  action       text        NOT NULL
                           CHECK (action IN (
                             'LOGIN', 'LOGOUT',
                             'CREATE', 'UPDATE', 'DELETE'
                           )),
  entity_type  text        NOT NULL,                     -- booking | circuit | user | …
  entity_id    text,
  entity_label text,                                     -- nom lisible de l'entité
  details      jsonb,                                    -- anciennes/nouvelles valeurs
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_audit_logs"
  ON audit_logs FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_audit_logs"
  ON audit_logs FOR SELECT TO anon USING (true);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at   ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id      ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action       ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type  ON audit_logs (entity_type);
