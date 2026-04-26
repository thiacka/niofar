/*
  # Tokens de réinitialisation de mot de passe (backoffice)

  Utilisés lors de la création d'un nouvel utilisateur admin :
  - Un token unique est généré et envoyé par email
  - L'utilisateur clique sur le lien et définit son mot de passe
  - Le token expire après 48 heures ou à la première utilisation
*/

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '48 hours'),
  used_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prt_token   ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_prt_user_id ON password_reset_tokens(user_id);

-- RLS : lecture publique par token (pour la page /admin/set-password sans auth)
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_by_token"
  ON password_reset_tokens FOR SELECT
  USING (true);

-- Seul le service role peut insérer/modifier (edge functions)
CREATE POLICY "service_role_all"
  ON password_reset_tokens FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
