import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { PageImageService } from '../../core/services/page-image.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-hero" [style.background-image]="'url(' + heroImage() + ')'">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('services.title') }}</h1>
      </div>
    </section>

    <section class="service-detail section">
      <div class="container">
        <div class="service-row">
          <div class="service-image">
            <img [src]="excursionsImage()" alt="Tailor-made excursions" />
          </div>
          <div class="service-content">
            <div class="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
            </div>
            <h2>{{ lang.t('services.excursions.title') }}</h2>
            <p>{{ lang.t('services.excursions.text') }}</p>
            <ul class="service-features">
              <li>Villages & local communities</li>
              <li>Markets & artisans</li>
              <li>National parks & nature reserves</li>
              <li>Iconic landmarks</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="service-detail section" style="background: var(--color-background-alt);">
      <div class="container">
        <div class="service-row reverse">
          <div class="service-image">
            <img [src]="transportImage()" alt="Airport transfers" />
          </div>
          <div class="service-content">
            <div class="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
            </div>
            <h2>{{ lang.t('services.transfers.title') }}</h2>
            <p>{{ lang.t('services.transfers.text') }}</p>
            <ul class="service-features">
              <li>AIBD Airport pickup & drop-off</li>
              <li>Professional, vetted drivers</li>
              <li>Comfortable air-conditioned vehicles</li>
              <li>24/7 availability</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="service-detail section">
      <div class="container">
        <div class="service-row">
          <div class="service-image">
            <img [src]="accommodationImage()" alt="Accommodation booking" />
          </div>
          <div class="service-content">
            <div class="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h2>{{ lang.t('services.accommodation.title') }}</h2>
            <p>{{ lang.t('services.accommodation.text') }}</p>
            <ul class="service-features">
              <li>Boutique hotels & lodges</li>
              <li>Traditional guesthouses</li>
              <li>Eco-friendly options</li>
              <li>Beachfront properties</li>
            </ul>
          </div>
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
    .page-hero {
      position: relative;
      height: 50vh;
      min-height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: cover;
      background-position: center;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(61, 43, 31, 0.75), rgba(43, 138, 138, 0.5));
    }

    .hero-content {
      position: relative;
      text-align: center;
      color: var(--color-white);
      padding-top: var(--header-height);
    }

    .hero-content h1 {
      color: var(--color-white);
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .service-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-4xl);
      align-items: center;
    }

    .service-row.reverse .service-image {
      order: 1;
    }

    .service-image {
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .service-image img {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }

    .service-icon {
      color: var(--color-primary);
      margin-bottom: var(--spacing-lg);
    }

    .service-content h2 {
      margin-bottom: var(--spacing-lg);
    }

    .service-content p {
      color: var(--color-text-light);
      margin-bottom: var(--spacing-xl);
      line-height: 1.8;
    }

    .service-features {
      list-style: none;
      padding: 0;
    }

    .service-features li {
      position: relative;
      padding-left: var(--spacing-xl);
      margin-bottom: var(--spacing-sm);
      color: var(--color-text);
    }

    .service-features li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-secondary);
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
      .service-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-2xl);
      }

      .service-row.reverse .service-image {
        order: 0;
      }
    }
  `]
})
export class ServicesComponent implements OnInit {
  lang = inject(LanguageService);
  private imageService = inject(PageImageService);

  heroImage = signal('https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1920');
  excursionsImage = signal('https://images.pexels.com/photos/3889827/pexels-photo-3889827.jpeg?auto=compress&cs=tinysrgb&w=800');
  transportImage = signal('https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=800');
  accommodationImage = signal('https://images.pexels.com/photos/2507007/pexels-photo-2507007.jpeg?auto=compress&cs=tinysrgb&w=800');

  ngOnInit(): void {
    this.loadImages();
  }

  async loadImages(): Promise<void> {
    const images = await this.imageService.getImagesByPage('services');

    const heroImg = images.find(img => img.section === 'hero');
    if (heroImg) this.heroImage.set(heroImg.image_url);

    const transportImg = images.find(img => img.section === 'transport');
    if (transportImg) this.transportImage.set(transportImg.image_url);

    const accommodationImg = images.find(img => img.section === 'accommodation');
    if (accommodationImg) this.accommodationImage.set(accommodationImg.image_url);

    const guideImg = images.find(img => img.section === 'guide');
    if (guideImg) this.excursionsImage.set(guideImg.image_url);
  }
}
