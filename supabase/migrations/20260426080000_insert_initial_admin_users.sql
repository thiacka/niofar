/*
  # Création des utilisateurs initiaux du backoffice

  Utilisateurs insérés :
  - Ngor THIAM       — administrator (Super-administrateur)
  - Amadou SARR      — manager       (Chef d'équipe)

  Les mots de passe sont hashés en SHA-256 (identique à la logique Angular/Web Crypto).
  Utilisation de ON CONFLICT pour éviter les doublons lors d'une réapplication.
*/

INSERT INTO users (id, email, name, role, password_hash, is_active, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'thiam.ngor@gmail.com',
    'Ngor THIAM',
    'administrator',
    '00c15625992ac27ef0b9e3a870f698943e52a19c81acede37aa9c7960c7366d1',  -- #NioFar2025!
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'josivoyages@gmail.com',
    'Amadou SARR',
    'manager',
    'bb1fd9e86eb35bf0218d3e7732678478e0fbdbc81936f7cf3abb34105ae29718',  -- NioFar2025!
    true,
    now(),
    now()
  )
ON CONFLICT (email) DO UPDATE SET
  name         = EXCLUDED.name,
  role         = EXCLUDED.role,
  password_hash = EXCLUDED.password_hash,
  is_active    = EXCLUDED.is_active,
  updated_at   = now();
