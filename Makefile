.PHONY: help build up down restart logs ssl-init ssl-renew backup restore clean

help:
	@echo "Commandes disponibles:"
	@echo "  make build       - Construire l'image Docker"
	@echo "  make up          - Démarrer les services"
	@echo "  make down        - Arrêter les services"
	@echo "  make restart     - Redémarrer les services"
	@echo "  make logs        - Afficher les logs"
	@echo "  make ssl-init    - Initialiser les certificats SSL"
	@echo "  make ssl-renew   - Renouveler les certificats SSL"
	@echo "  make backup      - Sauvegarder les certificats"
	@echo "  make restore     - Restaurer les certificats"
	@echo "  make clean       - Nettoyer les conteneurs et volumes"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

ssl-init:
	chmod +x init-letsencrypt.sh
	./init-letsencrypt.sh

ssl-renew:
	docker-compose run --rm certbot renew
	docker-compose exec web nginx -s reload

backup:
	@echo "Sauvegarde des certificats SSL..."
	tar -czf certbot-backup-$$(date +%Y%m%d-%H%M%S).tar.gz certbot/
	@echo "Sauvegarde terminée!"

restore:
	@echo "Restauration des certificats depuis le dernier backup..."
	@ls -t certbot-backup-*.tar.gz | head -1 | xargs tar -xzf
	@echo "Restauration terminée!"

clean:
	docker-compose down -v
	docker system prune -f
