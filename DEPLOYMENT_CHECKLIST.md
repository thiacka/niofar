# Checklist de Déploiement - Nio Far Tourisme

Utilisez cette checklist pour un déploiement réussi.

## Avant le Déploiement

### 1. Préparation du Serveur
- [ ] Serveur avec Ubuntu 20.04+ ou similaire
- [ ] Au moins 1GB RAM et 20GB disque
- [ ] Docker installé (`docker --version`)
- [ ] Docker Compose installé (`docker-compose --version`)
- [ ] Ports 80 et 443 ouverts dans le firewall
- [ ] Accès SSH au serveur configuré

### 2. Configuration DNS
- [ ] Enregistrement A: `nio-far-tourisme.com` → IP du serveur
- [ ] Enregistrement A: `www.nio-far-tourisme.com` → IP du serveur
- [ ] DNS propagé (vérifier avec `dig nio-far-tourisme.com`)
- [ ] Temps de propagation: attendre 15-30 minutes

### 3. Préparation du Code
- [ ] Code cloné sur le serveur
- [ ] Fichier `.env` créé avec les variables Supabase
- [ ] Email modifié dans `init-letsencrypt.sh`
- [ ] Scripts rendus exécutables (`chmod +x *.sh`)

## Installation

### 4. Premier Déploiement
```bash
# Méthode 1: Script automatique (recommandé)
./deploy.sh init

# OU Méthode 2: Commandes Make
make ssl-init

# OU Méthode 3: Manuelle
docker-compose build
./init-letsencrypt.sh
```

- [ ] Build Docker réussi
- [ ] Certificats SSL obtenus
- [ ] Nginx démarré
- [ ] Site accessible en HTTPS

### 5. Vérifications Post-Déploiement
- [ ] https://nio-far-tourisme.com charge correctement
- [ ] https://www.nio-far-tourisme.com charge correctement
- [ ] HTTP redirige vers HTTPS
- [ ] Certificat SSL valide (cadenas vert)
- [ ] Pas d'erreurs dans les logs: `docker-compose logs`
- [ ] Conteneurs actifs: `docker-compose ps`

## Tests de Fonctionnalité

### 6. Test des Pages Principales
- [ ] Page d'accueil
- [ ] Page circuits
- [ ] Page excursions
- [ ] Page location (rentals)
- [ ] Page contact
- [ ] Formulaire de contact fonctionne
- [ ] Formulaire de réservation fonctionne

### 7. Test des Fonctionnalités
- [ ] Changement de langue (FR/EN)
- [ ] Changement de devise (XOF/EUR/USD)
- [ ] Navigation entre les pages
- [ ] Images chargent correctement
- [ ] Formulaires envoient les données

### 8. Test Performance et Sécurité
- [ ] Score Lighthouse > 90
- [ ] Temps de chargement < 3s
- [ ] SSL Labs grade A: https://www.ssllabs.com/ssltest/
- [ ] Headers de sécurité présents
- [ ] HSTS activé
- [ ] Compression gzip active

## Monitoring et Maintenance

### 9. Configuration du Monitoring
- [ ] Logs configurés: `docker-compose logs -f`
- [ ] Alerte d'expiration SSL (30 jours avant)
- [ ] Monitoring CPU/RAM/Disque
- [ ] Backup automatique configuré

### 10. Documentation Équipe
- [ ] Accès serveur documenté
- [ ] Procédure de mise à jour documentée
- [ ] Contacts urgence listés
- [ ] Procédure rollback documentée

## Commandes de Vérification Rapide

```bash
# Status général
./deploy.sh status

# Logs en direct
docker-compose logs -f

# Vérifier nginx
docker-compose exec web nginx -t

# Vérifier certificats
docker-compose run --rm certbot certificates

# Test renouvellement SSL
docker-compose run --rm certbot renew --dry-run

# Ressources système
docker stats --no-stream
```

## En Cas de Problème

### Site inaccessible
1. Vérifier les conteneurs: `docker-compose ps`
2. Vérifier les logs: `docker-compose logs web`
3. Vérifier nginx: `docker-compose exec web nginx -t`
4. Redémarrer: `./deploy.sh restart`

### Erreur SSL
1. Vérifier les certificats: `ls -la certbot/conf/live/nio-far-tourisme.com/`
2. Réinitialiser: `./init-letsencrypt.sh`
3. Vérifier les logs: `docker-compose logs certbot`

### Problème de build
1. Nettoyer: `docker system prune -a`
2. Rebuild: `docker-compose build --no-cache`
3. Redémarrer: `docker-compose up -d`

## Contacts Urgence

- Admin Système: _____________
- Responsable Technique: _____________
- Support Supabase: support@supabase.io
- Support Let's Encrypt: https://community.letsencrypt.org/

## Notes

- Renouvellement SSL automatique toutes les 12h
- Backup recommandé quotidien
- Mise à jour de sécurité hebdomadaire
- Monitoring actif 24/7

---

**Date de déploiement**: ___________
**Déployé par**: ___________
**Version**: ___________
