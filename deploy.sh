#!/bin/bash

# Script de déploiement rapide pour Nio Far Tourisme
# Usage: ./deploy.sh [init|update|restart|status]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}================================${NC}"
}

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    print_info "Vérification des prérequis..."

    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose n'est pas installé"
        exit 1
    fi

    if [ ! -f .env ]; then
        print_error "Fichier .env manquant"
        exit 1
    fi

    print_info "Tous les prérequis sont satisfaits"
}

init_deployment() {
    print_header "INITIALISATION DU DÉPLOIEMENT"

    check_requirements

    print_info "Construction de l'image Docker..."
    docker-compose build

    print_info "Initialisation des certificats SSL..."
    chmod +x init-letsencrypt.sh
    ./init-letsencrypt.sh

    print_header "DÉPLOIEMENT TERMINÉ"
    print_info "Votre site est maintenant accessible à https://nio-far-tourisme.com"
}

update_deployment() {
    print_header "MISE À JOUR DU DÉPLOIEMENT"

    print_info "Récupération des dernières modifications..."
    git pull

    print_info "Reconstruction de l'image..."
    docker-compose build

    print_info "Redémarrage des services..."
    docker-compose up -d --force-recreate

    print_info "Attente du démarrage..."
    sleep 5

    print_info "Rechargement de nginx..."
    docker-compose exec web nginx -s reload

    print_header "MISE À JOUR TERMINÉE"
}

restart_services() {
    print_header "REDÉMARRAGE DES SERVICES"

    print_info "Redémarrage..."
    docker-compose restart

    print_info "Attente du démarrage..."
    sleep 5

    print_header "REDÉMARRAGE TERMINÉ"
}

show_status() {
    print_header "STATUT DES SERVICES"

    print_info "Conteneurs actifs:"
    docker-compose ps

    echo ""
    print_info "Utilisation des ressources:"
    docker stats --no-stream

    echo ""
    print_info "Certificat SSL:"
    if [ -d "certbot/conf/live/nio-far-tourisme.com" ]; then
        docker-compose run --rm certbot certificates
    else
        print_warning "Aucun certificat trouvé"
    fi
}

show_logs() {
    print_header "LOGS DES SERVICES"
    docker-compose logs -f
}

show_help() {
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commandes disponibles:"
    echo "  init      - Initialisation complète (première installation)"
    echo "  update    - Mise à jour du site"
    echo "  restart   - Redémarrer les services"
    echo "  status    - Afficher le statut"
    echo "  logs      - Afficher les logs"
    echo "  help      - Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  ./deploy.sh init      # Premier déploiement"
    echo "  ./deploy.sh update    # Mise à jour après modifications"
    echo "  ./deploy.sh status    # Vérifier le statut"
}

case "$1" in
    init)
        init_deployment
        ;;
    update)
        update_deployment
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        print_error "Commande inconnue: $1"
        show_help
        exit 1
        ;;
esac
