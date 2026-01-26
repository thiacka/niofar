# Guide Rapide Docker - Nio Far Tourisme

## Déploiement Initial

```bash
# 1. Configurer l'email dans init-letsencrypt.sh
nano init-letsencrypt.sh

# 2. Déployer
chmod +x deploy.sh
./deploy.sh init
```

## Commandes Rapides

### Avec le script deploy.sh
```bash
./deploy.sh init      # Premier déploiement
./deploy.sh update    # Mettre à jour le site
./deploy.sh restart   # Redémarrer les services
./deploy.sh status    # Voir le statut
./deploy.sh logs      # Voir les logs
```

### Avec Make
```bash
make build        # Construire l'image
make up           # Démarrer
make down         # Arrêter
make restart      # Redémarrer
make logs         # Logs
make ssl-init     # Init SSL
make ssl-renew    # Renouveler SSL
make backup       # Backup certificats
make restore      # Restaurer certificats
```

### Avec Docker Compose directement
```bash
# Build
docker-compose build

# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Logs
docker-compose logs -f web

# Redémarrer un service
docker-compose restart web

# Rebuild et redémarrer
docker-compose up -d --force-recreate --build
```

## Développement Local

```bash
# Build et démarrer en mode dev (sans SSL)
docker-compose -f docker-compose.dev.yml up -d

# Accessible sur http://localhost:8080
```

## Commandes Utiles

### Voir les conteneurs actifs
```bash
docker-compose ps
```

### Exécuter une commande dans un conteneur
```bash
docker-compose exec web sh
```

### Voir l'utilisation des ressources
```bash
docker stats
```

### Nettoyer le système
```bash
docker system prune -a
```

### Vérifier les certificats SSL
```bash
docker-compose run --rm certbot certificates
```

### Tester le renouvellement SSL
```bash
docker-compose run --rm certbot renew --dry-run
```

## Structure des Fichiers

```
project/
├── Dockerfile                 # Image Docker multi-stage
├── docker-compose.yml        # Config production avec SSL
├── docker-compose.dev.yml    # Config développement
├── nginx.conf                # Config nginx avec SSL
├── nginx.dev.conf            # Config nginx sans SSL
├── init-letsencrypt.sh       # Script init SSL
├── deploy.sh                 # Script de déploiement
├── Makefile                  # Commandes Make
├── DEPLOYMENT.md             # Guide complet
└── certbot/                  # Certificats SSL (gitignored)
    ├── conf/
    └── www/
```

## Ports

- **80**: HTTP (redirige vers HTTPS)
- **443**: HTTPS
- **8080**: Développement local (docker-compose.dev.yml)

## Variables d'Environnement

Fichier `.env` requis:
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

## Monitoring

### Voir les logs en temps réel
```bash
docker-compose logs -f
```

### Voir les logs d'un service spécifique
```bash
docker-compose logs -f web
docker-compose logs -f certbot
```

### Vérifier la santé du système
```bash
docker-compose ps
docker stats --no-stream
```

## Dépannage

### Le site ne démarre pas
```bash
# Vérifier les logs
docker-compose logs web

# Vérifier la config nginx
docker-compose exec web nginx -t

# Redémarrer
docker-compose restart web
```

### Problème SSL
```bash
# Vérifier les certificats
ls -la certbot/conf/live/nio-far-tourisme.com/

# Réinitialiser SSL
./init-letsencrypt.sh

# Forcer le renouvellement
docker-compose run --rm certbot renew --force-renewal
docker-compose exec web nginx -s reload
```

### Erreur de build
```bash
# Nettoyer le cache
docker-compose build --no-cache

# Nettoyer tout
docker system prune -a
docker-compose build
```

## Sécurité

- Certificats SSL de Let's Encrypt (renouvellement auto)
- HTTPS forcé (redirection HTTP → HTTPS)
- Headers de sécurité configurés
- TLS 1.2+ uniquement
- HSTS activé

## Performance

- Build multi-stage (image optimisée)
- Compression gzip
- Cache des assets statiques
- HTTP/2 activé

## Support

Pour plus de détails, voir [DEPLOYMENT.md](DEPLOYMENT.md)
