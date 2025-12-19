# Plan d'implementation - Site Web NIO FAR

## Resume du projet
Site vitrine pour NIO FAR, agence de tourisme au Senegal. Design chaleureux africain, 6 pages, bilingue FR/EN.

## Stack technique
- **Frontend**: Angular 21 (standalone components)
- **Backend/DB**: Supabase (formulaire de contact)
- **Styles**: CSS avec variables (palette africaine)
- **Routing**: Angular Router avec lazy loading

## Palette de couleurs
- Primaire (Ocre): #C4682B
- Secondaire (Turquoise): #2B8A8A
- Accent (Jaune soleil): #F4A836
- Texte (Brun fonce): #3D2B1F
- Fond (Beige sable): #F5EFE6

## Structure des fichiers

```
src/
  app/
    core/
      services/
        contact.service.ts
        language.service.ts
        supabase.service.ts
      models/
        contact.model.ts
    shared/
      components/
        header/
        footer/
        language-switcher/
        cta-button/
    pages/
      home/
      about/
      services/
      experiences/
      why-nio-far/
      contact/
    app.component.ts
    app.routes.ts
    app.config.ts
  environments/
    environment.ts
  global_styles.css
  index.html
  main.ts
```

## Pages a creer

### 1. Accueil (Home)
- Hero section avec image de fond (baobab/paysage)
- Presentation courte de NIO FAR
- Apercu des services (3 cartes)
- CTA "Book your experience"

### 2. A propos (About)
- "Who we are" - histoire et mission
- Valeurs (4 items avec icones)
- Message "With NIO FAR, you never travel alone"

### 3. Services
- Excursions sur mesure
- Transferts aeroport
- Reservation d'hebergements
- Chaque service avec description et image

### 4. Experiences
- Section immersive
- 4 types: Cultural, Nature, Traditions, Lifestyle
- Galerie d'images

### 5. Pourquoi NIO FAR (Why Us)
- 5 avantages differenciants
- Design avec icones et animations subtiles

### 6. Contact
- Formulaire (Name, Email, Country, Message)
- Infos de contact (WhatsApp, Email, Location)
- Sauvegarde dans Supabase

## Base de donnees Supabase

### Table: contact_messages
- id (uuid, PK)
- name (text)
- email (text)
- country (text)
- message (text)
- created_at (timestamptz)
- RLS: Insert public, Select authenticated only

## Composants partages

### Header
- Logo NIO FAR
- Navigation (6 liens)
- Language switcher (FR/EN)
- Responsive (hamburger menu mobile)

### Footer
- Logo + slogan
- Liens rapides
- Contact info
- Copyright

### CTA Button
- Style chaleureux (ocre/jaune)
- Hover animation

## Internationalisation (i18n)
- Service LanguageService avec BehaviorSubject
- Fichiers de traduction JSON (fr.json, en.json)
- Pipe de traduction ou interpolation directe

## Images (Pexels)
- Hero: Paysage senegalais / baobab
- Services: Photos d'excursions, vehicules, lodges
- Experiences: Culture, nature, marches
- About: Photos de personnes/guides

## Etapes d'implementation

1. Configuration projet (routing, Supabase, styles globaux)
2. Composants partages (header, footer, buttons)
3. Service de langue + traductions
4. Page Accueil
5. Page A propos
6. Page Services
7. Page Experiences
8. Page Pourquoi NIO FAR
9. Page Contact + integration Supabase
10. Migration base de donnees Supabase
11. Tests et build final

## Design highlights
- Animations douces (fade-in au scroll)
- Cartes avec coins arrondis
- Ombres legeres
- Typographie: Playfair Display (titres) + Nunito (corps)
- Full responsive (mobile-first)
