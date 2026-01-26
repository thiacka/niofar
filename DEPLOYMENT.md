# Guide de Déploiement - Nio Far Tourisme

Ce guide explique comment déployer le site web Nio Far Tourisme avec Docker et SSL.

## Prérequis

- Docker et Docker Compose installés sur le serveur
- Un nom de domaine pointant vers votre serveur (nio-far-tourisme.com)
- Ports 80 et 443 ouverts sur le serveur
- Un serveur avec au moins 1GB de RAM

## Configuration DNS

Assurez-vous que les enregistrements DNS suivants pointent vers l'IP de votre serveur:

```
A    nio-far-tourisme.com       -> VOTRE_IP_SERVEUR
A    www.nio-far-tourisme.com   -> VOTRE_IP_SERVEUR
```

Vous pouvez vérifier avec:
```bash
dig nio-far-tourisme.com
dig www.nio-far-tourisme.com
```

## Installation

### 1. Cloner le projet sur le serveur

```bash
git clone <votre-repo>
cd project
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet:

```bash
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### 3. Modifier l'email dans init-letsencrypt.sh

Éditez le fichier `init-letsencrypt.sh` et remplacez:

```bash
email="admin@nio-far-tourisme.com"
```

Par votre véritable adresse email.

### 4. Rendre le script exécutable

```bash
chmod +x init-letsencrypt.sh
```

### 5. Exécuter le script d'initialisation SSL

```bash
./init-letsencrypt.sh
```

Ce script va:
- Télécharger les paramètres TLS recommandés
- Créer un certificat temporaire pour démarrer nginx
- Demander un véritable certificat SSL à Let's Encrypt
- Configurer le renouvellement automatique

### 6. Vérifier que tout fonctionne

Visitez https://nio-far-tourisme.com dans votre navigateur. Vous devriez voir:
- Le cadenas vert (certificat SSL valide)
- Le site chargé correctement
- Une redirection automatique de HTTP vers HTTPS

## Gestion du déploiement

### Démarrer les services

```bash
docker-compose up -d
```

### Arrêter les services

```bash
docker-compose down
```

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Seulement nginx
docker-compose logs -f web

# Seulement certbot
docker-compose logs -f certbot
```

### Redéployer après des modifications

```bash
# Rebuild l'image
docker-compose build

# Redémarrer avec la nouvelle image
docker-compose up -d --force-recreate
```

## Renouvellement SSL

Le certificat SSL est automatiquement renouvelé tous les 12 heures par le conteneur certbot. Nginx est rechargé toutes les 6 heures pour prendre en compte les nouveaux certificats.

### Forcer un renouvellement manuel

```bash
docker-compose run --rm certbot renew
docker-compose exec web nginx -s reload
```

## Maintenance

### Sauvegarder les certificats

```bash
tar -czf certbot-backup.tar.gz certbot/
```

### Restaurer les certificats

```bash
tar -xzf certbot-backup.tar.gz
```

### Mettre à jour le site

```bash
# 1. Récupérer les dernières modifications
git pull

# 2. Rebuild et redéployer
docker-compose build
docker-compose up -d --force-recreate
```

### Surveiller l'utilisation des ressources

```bash
docker stats
```

## Résolution de problèmes

### Le site n'est pas accessible

1. Vérifiez que les conteneurs tournent:
```bash
docker-compose ps
```

2. Vérifiez les logs:
```bash
docker-compose logs web
```

3. Vérifiez que les ports sont ouverts:
```bash
netstat -tlnp | grep -E ':(80|443)'
```

### Erreur SSL

1. Vérifiez que les certificats existent:
```bash
ls -la certbot/conf/live/nio-far-tourisme.com/
```

2. Relancez l'initialisation SSL:
```bash
./init-letsencrypt.sh
```

### Problème de renouvellement automatique

1. Testez le renouvellement manuellement:
```bash
docker-compose run --rm certbot renew --dry-run
```

2. Vérifiez les logs de certbot:
```bash
docker-compose logs certbot
```

## Sécurité

Le site est configuré avec:
- TLS 1.2 et 1.3 uniquement
- Ciphers sécurisés
- HSTS activé (max-age: 1 an)
- Headers de sécurité (X-Frame-Options, X-Content-Type-Options, etc.)
- Redirection automatique HTTP → HTTPS

## Performance

Le site est configuré avec:
- Compression gzip activée
- Cache des assets statiques (1 an)
- HTTP/2 activé
- Optimisations nginx

## Support

Pour toute question, contactez l'administrateur système.
