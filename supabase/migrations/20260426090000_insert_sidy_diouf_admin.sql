/*
  # Ajout de l'utilisateur Sidy DIOUF

  Utilisateur inséré :
  - Sidy DIOUF — administrator

  Le mot de passe est hashé en SHA-256 (identique à la logique Angular/Web Crypto).
  Utilisation de ON CONFLICT pour éviter les doublons lors d'une réapplication.
*/

INSERT INTO users (id, email, name, role, password_hash, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'sidy@kdl.sn',
  'Sidy DIOUF',
  'administrator',
  '9549c932a605f04428cd61d02786e72746ce2de60d81898ccce147c5bddee430',  -- #SidyNioFar!2026
  true,
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE SET
  name          = EXCLUDED.name,
  role          = EXCLUDED.role,
  password_hash = EXCLUDED.password_hash,
  is_active     = EXCLUDED.is_active,
  updated_at    = now();
