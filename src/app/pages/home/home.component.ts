import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1 class="fade-in">{{ lang.t('hero.title') }}</h1>
        <p class="hero-subtitle fade-in">{{ lang.t('hero.subtitle') }}</p>
        <a routerLink="/contact" class="btn btn-accent fade-in">{{ lang.t('hero.cta') }}</a>
      </div>
    </section>

    <section class="intro section">
      <div class="container">
        <div class="intro-content">
          <div class="intro-text">
            <h2>{{ lang.t('home.intro.title') }}</h2>
            <p>{{ lang.t('home.intro.text') }}</p>
            <a routerLink="/about" class="btn btn-secondary">{{ lang.t('nav.about') }}</a>
          </div>
          <div class="intro-image">
            <img src="https://images.pexels.com/photos/5560549/pexels-photo-5560549.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Senegal landscape" />
          </div>
        </div>
      </div>
    </section>

    <section class="services-preview section" style="background: var(--color-background-alt);">
      <div class="container">
        <div class="section-title">
          <h2>{{ lang.t('home.services.title') }}</h2>
        </div>
        <div class="services-grid">
          <div class="service-card card">
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
          <div class="service-card card">
            <div class="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
            </div>
            <h3>{{ lang.t('home.services.transfers') }}</h3>
            <p>{{ lang.t('home.services.transfers.desc') }}</p>
          </div>
          <div class="service-card card">
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
        <div class="services-cta">
          <a routerLink="/services" class="btn btn-primary">{{ lang.t('nav.services') }}</a>
        </div>
      </div>
    </section>

    <section class="gallery section">
      <div class="container">
        <div class="section-title">
          <h2>{{ lang.t('experiences.title') }}</h2>
          <p>{{ lang.t('experiences.subtitle') }}</p>
        </div>
        <div class="gallery-grid">
          <div class="gallery-item">
            <img src="https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cultural encounter" />
            <div class="gallery-overlay">
              <span>{{ lang.t('experiences.cultural') }}</span>
            </div>
          </div>
          <div class="gallery-item">
            <img src="https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Nature wildlife" />
            <div class="gallery-overlay">
              <span>{{ lang.t('experiences.nature') }}</span>
            </div>
          </div>
          <div class="gallery-item">
            <img src="https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Local traditions" />
            <div class="gallery-overlay">
              <span>{{ lang.t('experiences.traditions') }}</span>
            </div>
          </div>
          <div class="gallery-item">
            <img src="https://images.pexels.com/photos/3889891/pexels-photo-3889891.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Senegalese lifestyle" />
            <div class="gallery-overlay">
              <span>{{ lang.t('experiences.lifestyle') }}</span>
            </div>
          </div>
        </div>
        <div class="gallery-cta">
          <a routerLink="/experiences" class="btn btn-secondary">{{ lang.t('nav.experiences') }}</a>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
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
      background: url('https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(61, 43, 31, 0.7), rgba(43, 138, 138, 0.4));
    }

    .hero-content {
      position: relative;
      text-align: center;
      color: var(--color-white);
      padding-top: var(--header-height);
    }

    .hero-content h1 {
      color: var(--color-white);
      margin-bottom: var(--spacing-lg);
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto var(--spacing-2xl);
      opacity: 0.95;
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
      grid-template-columns: repeat(4, 1fr);
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
    }

    @media (max-width: 480px) {
      .hero {
        min-height: 500px;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .gallery-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
  lang = inject(LanguageService);
}
