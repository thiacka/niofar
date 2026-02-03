import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { PageImageService } from '../../core/services/page-image.service';
import { EditableContentDirective } from '../../shared/directives/editable-content.directive';

interface HeroSlide {
  image: string;
  titleKey: string;
  subtitleKey: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ScrollAnimateDirective, EditableContentDirective],
  template: `
    <section class="hero">
      @for (slide of slides; track slide.titleKey; let i = $index) {
        <div
          class="hero-slide"
          [class.active]="currentSlide() === i"
          [class.prev]="prevSlide() === i"
          [style.background-image]="'url(' + slide.image + ')'"
        ></div>
      }
      <div class="hero-overlay"></div>

      <div class="hero-content container">
        <span
          class="hero-slogan"
          appEditableContent
          contentPage="home"
          contentSection="hero"
          contentKey="slogan"
        >{{ lang.t('hero.slogan') }}</span>
        <h1
          class="hero-title"
          appEditableContent
          contentPage="home"
          contentSection="hero"
          [contentKey]="'title-' + currentSlide()"
        >{{ lang.t(slides[currentSlide()].titleKey) }}</h1>
        <p
          class="hero-subtitle"
          appEditableContent
          contentPage="home"
          contentSection="hero"
          [contentKey]="'subtitle-' + currentSlide()"
        >{{ lang.t(slides[currentSlide()].subtitleKey) }}</p>
        <a [routerLink]="slides[currentSlide()].route" class="btn btn-accent">{{ lang.t('hero.cta') }}</a>
      </div>

      <div class="hero-nav">
        @for (slide of slides; track slide.titleKey; let i = $index) {
          <button
            class="hero-dot"
            [class.active]="currentSlide() === i"
            (click)="goToSlide(i)"
            [attr.aria-label]="'Slide ' + (i + 1)"
          >
            <span class="dot-progress" [class.animate]="currentSlide() === i"></span>
          </button>
        }
      </div>

      <button class="hero-arrow hero-arrow-left" (click)="prevSlideAction()" aria-label="Previous slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button class="hero-arrow hero-arrow-right" (click)="nextSlide()" aria-label="Next slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </section>

    <section class="intro section">
      <div class="container">
        <div class="intro-content">
          <div class="intro-text" appScrollAnimate animationType="fade-right">
            <h2
              appEditableContent
              contentPage="home"
              contentSection="intro"
              contentKey="title"
            >{{ lang.t('home.intro.title') }}</h2>
            <p
              appEditableContent
              contentPage="home"
              contentSection="intro"
              contentKey="text"
            >{{ lang.t('home.intro.text') }}</p>
            <a routerLink="/why-nio-far" class="btn btn-secondary">{{ lang.t('nav.about') }}</a>
          </div>
          <div class="intro-image" appScrollAnimate animationType="fade-left" [animationDelay]="200">
            <img [src]="discoverImage()" alt="Senegal landscape" />
          </div>
        </div>
      </div>
    </section>

    <section class="services-preview section" style="background: var(--color-background-alt);">
      <div class="container">
        <div class="section-title" appScrollAnimate>
          <h2
            appEditableContent
            contentPage="home"
            contentSection="services"
            contentKey="title"
          >{{ lang.t('home.services.title') }}</h2>
        </div>
        <div class="services-grid">
          <div class="service-card card" appScrollAnimate [animationDelay]="0">
            <div class="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
            </div>
            <h3>{{ lang.t('home.services.excursions') }}</h3>
            <p>{{ lang.t('home.services.excursions.desc') }}</p>
          </div>
          <div class="service-card card" appScrollAnimate [animationDelay]="150">
            <div class="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
            </div>
            <h3>{{ lang.t('home.services.transfers') }}</h3>
            <p>{{ lang.t('home.services.transfers.desc') }}</p>
          </div>
          <div class="service-card card" appScrollAnimate [animationDelay]="300">
            <div class="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3>{{ lang.t('home.services.accommodation') }}</h3>
            <p>{{ lang.t('home.services.accommodation.desc') }}</p>
          </div>
        </div>
        <div class="services-cta" appScrollAnimate [animationDelay]="400">
          <a routerLink="/services" class="btn btn-primary">{{ lang.t('nav.services') }}</a>
        </div>
      </div>
    </section>

    <section class="gallery section">
      <div class="container">
        <div class="section-title" appScrollAnimate>
          <h2>{{ lang.t('experiences.title') }}</h2>
          <p>{{ lang.t('experiences.subtitle') }}</p>
        </div>
        <div class="gallery-grid">
          @for (item of experiencesGallery(); track item.image; let i = $index) {
            <div class="gallery-item" appScrollAnimate animationType="scale" [animationDelay]="i * 100">
              <img [src]="item.image" [alt]="lang.t(item.labelKey)" />
              <div class="gallery-overlay">
                <span>{{ lang.t(item.labelKey) }}</span>
              </div>
            </div>
          }
        </div>
        <div class="gallery-cta" appScrollAnimate [animationDelay]="400">
          <a routerLink="/experiences" class="btn btn-secondary">{{ lang.t('nav.experiences') }}</a>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content" appScrollAnimate animationType="fade-in">
          <h2>{{ lang.t('contact.title') }}</h2>
          <a routerLink="/contact" class="btn btn-accent">{{ lang.t('hero.cta') }}</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      height: 100vh;
      min-height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .hero-slide {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transform: scale(1.1);
      transition: opacity 1s ease, transform 6s ease;
      z-index: 0;
    }

    .hero-slide.active {
      opacity: 1;
      transform: scale(1);
      z-index: 1;
    }

    .hero-slide.prev {
      opacity: 0;
      z-index: 0;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(61, 43, 31, 0.7), rgba(43, 138, 138, 0.4));
      z-index: 2;
    }

    .hero-content {
      position: relative;
      text-align: center;
      color: var(--color-white);
      padding-top: var(--header-height);
      z-index: 3;
    }

    .hero-slogan {
      display: inline-block;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--color-accent);
      margin-bottom: var(--spacing-lg);
      padding: var(--spacing-xs) var(--spacing-lg);
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-full);
      animation: fadeInDown 0.6s ease;
    }

    .hero-title {
      color: var(--color-white);
      margin-bottom: var(--spacing-md);
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      animation: fadeInUp 0.6s ease 0.2s both;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto var(--spacing-2xl);
      opacity: 0.95;
      animation: fadeInUp 0.6s ease 0.4s both;
    }

    .hero-content .btn {
      animation: fadeInUp 0.6s ease 0.6s both;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-nav {
      position: absolute;
      bottom: var(--spacing-3xl);
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: var(--spacing-md);
      z-index: 4;
    }

    .hero-dot {
      width: 48px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border: none;
      border-radius: var(--radius-full);
      cursor: pointer;
      overflow: hidden;
      transition: background var(--transition-base);
      position: relative;
    }

    .hero-dot:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    .dot-progress {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0;
      background: var(--color-accent);
      border-radius: var(--radius-full);
    }

    .dot-progress.animate {
      animation: progressBar 6s linear forwards;
    }

    @keyframes progressBar {
      from {
        width: 0;
      }
      to {
        width: 100%;
      }
    }

    .hero-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: var(--color-white);
      cursor: pointer;
      z-index: 4;
      transition: all var(--transition-base);
      backdrop-filter: blur(4px);
    }

    .hero-arrow:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-50%) scale(1.1);
    }

    .hero-arrow-left {
      left: var(--spacing-xl);
    }

    .hero-arrow-right {
      right: var(--spacing-xl);
    }

    .intro-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-4xl);
      align-items: center;
    }

    .intro-text h2 {
      margin-bottom: var(--spacing-lg);
    }

    .intro-text p {
      color: var(--color-text-light);
      margin-bottom: var(--spacing-xl);
    }

    .intro-image {
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .intro-image img {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-xl);
      margin-bottom: var(--spacing-2xl);
    }

    .service-card {
      padding: var(--spacing-2xl);
      text-align: center;
    }

    .service-icon {
      color: var(--color-primary);
      margin-bottom: var(--spacing-lg);
    }

    .service-card h3 {
      margin-bottom: var(--spacing-md);
    }

    .service-card p {
      color: var(--color-text-light);
      margin: 0;
    }

    .services-cta,
    .gallery-cta {
      text-align: center;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .gallery-item {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      aspect-ratio: 1;
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .gallery-item:hover img {
      transform: scale(1.1);
    }

    .gallery-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(61, 43, 31, 0.8), transparent);
      display: flex;
      align-items: flex-end;
      padding: var(--spacing-lg);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .gallery-item:hover .gallery-overlay {
      opacity: 1;
    }

    .gallery-overlay span {
      color: var(--color-white);
      font-weight: 600;
      font-size: 0.95rem;
    }

    .cta-section {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      padding: var(--spacing-4xl) 0;
    }

    .cta-content {
      text-align: center;
    }

    .cta-content h2 {
      color: var(--color-white);
      margin-bottom: var(--spacing-xl);
    }

    @media (max-width: 992px) {
      .intro-content {
        grid-template-columns: 1fr;
        gap: var(--spacing-2xl);
      }

      .intro-image {
        order: -1;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }

      .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .hero-arrow {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .hero {
        min-height: 500px;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .hero-slogan {
        font-size: 0.75rem;
        padding: var(--spacing-xs) var(--spacing-md);
      }

      .gallery-grid {
        grid-template-columns: 1fr;
      }

      .hero-nav {
        bottom: var(--spacing-2xl);
      }

      .hero-dot {
        width: 32px;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  lang = inject(LanguageService);
  private imageService = inject(PageImageService);

  currentSlide = signal(0);
  prevSlide = signal(-1);
  discoverImage = signal('https://media.istockphoto.com/id/1395604867/fr/photo/exp%C3%A9rience-de-safari-et-famille-de-girafes-dans-la-r%C3%A9serve-de-vie-sauvage-dafrique-de.jpg?s=612x612&w=0&k=20&c=G9mXb-ZD7rOnMtccGAjq0AGm6iefQ9HE0mqoztLXy-k=');
  experiencesGallery = signal<Array<{ image: string; labelKey: string }>>([
    { image: 'https://media.istockphoto.com/id/2207596598/fr/photo/figurines-africaines-en-bois-en-vente-sur-le-march%C3%A9-%C3%A0-joal-fadiuth-au-s%C3%A9n%C3%A9gal.jpg?s=612x612&w=0&k=20&c=Ua7ezVZq8GVYn7c_UCW6Aw2mI0GNmFCrauWy-ZtUxF0=', labelKey: 'experiences.cultural.title' },
    { image: 'https://media.istockphoto.com/id/1200689275/fr/photo/extrait-du-sel-du-lac.jpg?s=612x612&w=0&k=20&c=R47um58ZljNs53AN00PUnrHFiM9CWEg5Zz5c0fpMpeU=', labelKey: 'experiences.nature.title' },
    { image: 'https://media.istockphoto.com/id/2191998179/fr/photo/danse-kumpo-avec-des-masques-au-s%C3%A9n%C3%A9gal-afrique-de-louest.jpg?s=612x612&w=0&k=20&c=iEsbWIW71SDkNXxAR3enLNG8Msvbcrgbb05uqcLYiNE=', labelKey: 'experiences.traditions.title' },
    { image: 'https://media.istockphoto.com/id/1039841242/fr/photo/homme-non-identifi%C3%A9-de-diola-dans-un-costume-de-foin-se-d%C3%A9place-au-cours-dune-danse.jpg?s=612x612&w=0&k=20&c=SageibHHel3p9so3fGyu9EC_Lz-rzIFyhcTaPKV2Ojk=', labelKey: 'experiences.lifestyle.title' }
  ]);
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;

  slides: HeroSlide[] = [
    {
      image: 'https://media.istockphoto.com/id/2193209869/fr/photo/le-pêcheur-au-bord-du-lac-retba-lac-rose-près-de-dakar-sénégal-afrique-de-louest.jpg?s=612x612&w=0&k=20&c=Bq5SoLlcQNEjsRXrcli6p7_Ia0rhT2MLGc7FrFVLxGg=',
      titleKey: 'hero.slide1.title',
      subtitleKey: 'hero.slide1.subtitle',
      route: '/circuits'
    },
    {
      image: 'https://media.istockphoto.com/id/1174741506/fr/photo/gor%C3%A9e-island-in-dakar-senegal.jpg?s=612x612&w=0&k=20&c=PZSA07Mf62lbWPp1EwOukqtZpCqmvcFk6N-rgG9upnM=',
      titleKey: 'hero.slide2.title',
      subtitleKey: 'hero.slide2.subtitle',
      route: '/circuits'
    },
    {
      image: 'https://media.istockphoto.com/id/1161760399/fr/photo/senegal-joal-fadiouth-ancient-millet-loft-on-piles.jpg?s=612x612&w=0&k=20&c=SUrFoFP1dp04J4bBngEV6DC-RPm2w9ZD1njY0SPqlDQ=',
      titleKey: 'hero.slide3.title',
      subtitleKey: 'hero.slide3.subtitle',
      route: '/circuits'
    },
    {
      image: 'https://media.istockphoto.com/id/2202664343/fr/photo/p%C3%AAcheur-s%C3%A9n%C3%A9galais-dans-le-bateau-attrapant-des-poissons-avec-des-filets-pr%C3%A8s-du-pont-de-fer.jpg?s=612x612&w=0&k=20&c=4kqHVVhnKdhdH1oVvS1vJqOAtAB2H1Sxb4-BBWcrIJU=',
      titleKey: 'hero.slide4.title',
      subtitleKey: 'hero.slide4.subtitle',
      route: '/circuits'
    }
  ];

  ngOnInit(): void {
    this.loadImages();
    this.startAutoPlay();
  }

  async loadImages(): Promise<void> {
    const images = await this.imageService.getImagesByPage('home');

    const heroImages = images.filter(img => img.section === 'hero');
    if (heroImages.length > 0) {
      this.slides = heroImages.map((img, index) => ({
        image: img.image_url,
        titleKey: `hero.slide${index + 1}.title`,
        subtitleKey: `hero.slide${index + 1}.subtitle`,
        route: '/circuits'
      }));
    }

    const discoverImg = images.find(img => img.section === 'discover');
    if (discoverImg) {
      this.discoverImage.set(discoverImg.image_url);
    }

    const experiencesImages = images.filter(img => img.section === 'experiences' && img.is_active);
    if (experiencesImages.length > 0) {
      const labelKeys = ['experiences.cultural.title', 'experiences.nature.title', 'experiences.traditions.title', 'experiences.lifestyle.title'];
      this.experiencesGallery.set(
        experiencesImages
          .sort((a, b) => a.display_order - b.display_order)
          .map((img, index) => ({
            image: img.image_url,
            labelKey: labelKeys[index] || 'experiences.cultural.title'
          }))
      );
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  nextSlide(): void {
    this.prevSlide.set(this.currentSlide());
    this.currentSlide.update(current => (current + 1) % this.slides.length);
  }

  prevSlideAction(): void {
    this.resetAutoPlay();
    this.prevSlide.set(this.currentSlide());
    this.currentSlide.update(current => (current - 1 + this.slides.length) % this.slides.length);
  }

  goToSlide(index: number): void {
    if (index !== this.currentSlide()) {
      this.resetAutoPlay();
      this.prevSlide.set(this.currentSlide());
      this.currentSlide.set(index);
    }
  }
}
