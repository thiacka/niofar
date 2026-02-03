import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { PageImageService } from '../../core/services/page-image.service';

@Component({
  selector: 'app-why-nio-far',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-hero" [style.background-image]="'url(' + heroImage() + ')'">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('why.title') }}</h1>
      </div>
    </section>

    <section class="reasons section">
      <div class="container">
        <div class="reasons-grid">
          <div class="reason-card">
            <div class="reason-number">01</div>
            <div class="reason-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3>{{ lang.t('why.local.title') }}</h3>
            <p>{{ lang.t('why.local.text') }}</p>
          </div>

          <div class="reason-card">
            <div class="reason-number">02</div>
            <div class="reason-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>{{ lang.t('why.guides.title') }}</h3>
            <p>{{ lang.t('why.guides.text') }}</p>
          </div>

          <div class="reason-card">
            <div class="reason-number">03</div>
            <div class="reason-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3>{{ lang.t('why.support.title') }}</h3>
            <p>{{ lang.t('why.support.text') }}</p>
          </div>

          <div class="reason-card">
            <div class="reason-number">04</div>
            <div class="reason-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M12 8v4"/>
                <path d="M12 16h.01"/>
              </svg>
            </div>
            <h3>{{ lang.t('why.responsible.title') }}</h3>
            <p>{{ lang.t('why.responsible.text') }}</p>
          </div>

          <div class="reason-card featured">
            <div class="reason-number">05</div>
            <div class="reason-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h3>{{ lang.t('why.immersion.title') }}</h3>
            <p>{{ lang.t('why.immersion.text') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="promise section" style="background: var(--color-background-alt);">
      <div class="container">
        <div class="promise-content">
          <div class="promise-image">
            <img [src]="teamImage()" alt="NIO FAR promise" />
          </div>
          <div class="promise-text">
            <h2>{{ lang.t('why.promise.title') }}</h2>
            <p>{{ lang.t('why.promise.text1') }}</p>
            <p>{{ lang.t('why.promise.text2') }}</p>
            <blockquote>
              <p>"{{ lang.t('why.closing') }}"</p>
            </blockquote>
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

    .reasons-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-xl);
    }

    .reason-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-md);
      transition: all var(--transition-base);
      position: relative;
    }

    .reason-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .reason-card.featured {
      background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
      color: var(--color-white);
      grid-column: span 2;
    }

    .reason-card.featured h3 {
      color: var(--color-white);
    }

    .reason-card.featured .reason-icon {
      color: var(--color-accent);
    }

    .reason-card.featured .reason-number {
      color: rgba(255,255,255,0.3);
    }

    .reason-number {
      font-family: var(--font-heading);
      font-size: 3rem;
      font-weight: 700;
      color: rgba(196, 104, 43, 0.15);
      position: absolute;
      top: var(--spacing-lg);
      right: var(--spacing-xl);
      line-height: 1;
    }

    .reason-icon {
      color: var(--color-primary);
      margin-bottom: var(--spacing-lg);
    }

    .reason-card h3 {
      margin-bottom: var(--spacing-md);
    }

    .reason-card p {
      color: var(--color-text-light);
      margin: 0;
      line-height: 1.7;
    }

    .reason-card.featured p {
      color: rgba(255,255,255,0.9);
    }

    .promise-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-4xl);
      align-items: center;
    }

    .promise-image {
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .promise-image img {
      width: 100%;
      height: 450px;
      object-fit: cover;
    }

    .promise-text h2 {
      margin-bottom: var(--spacing-lg);
    }

    .promise-text p {
      color: var(--color-text-light);
      line-height: 1.8;
    }

    .promise-text blockquote {
      margin-top: var(--spacing-xl);
      padding-left: var(--spacing-xl);
      border-left: 4px solid var(--color-primary);
    }

    .promise-text blockquote p {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-style: italic;
      color: var(--color-text);
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
      .reasons-grid {
        grid-template-columns: 1fr;
      }

      .reason-card.featured {
        grid-column: span 1;
      }

      .promise-content {
        grid-template-columns: 1fr;
        gap: var(--spacing-2xl);
      }
    }
  `]
})
export class WhyNioFarComponent implements OnInit {
  lang = inject(LanguageService);
  private imageService = inject(PageImageService);

  heroImage = signal('https://media.istockphoto.com/id/1253037128/fr/photo/paysage-africain-paisible-s%C3%A9n%C3%A9gal-afrique.jpg?s=612x612&w=0&k=20&c=FgB2IkFcBtMO_pgLI08D0vKZpiPOtHPPmtecvm7jNd4=');
  teamImage = signal('https://media.istockphoto.com/id/2178639991/fr/photo/paumes-lev%C3%A9es-des-mains-dun-groupe-de-personnes-multinationales-des-africains-des-latino.jpg?s=612x612&w=0&k=20&c=KEgGbdjgbZzMlkXaOxnkRExaryk7jRHjOTJll9jS5zk=');

  ngOnInit(): void {
    this.loadImages();
  }

  async loadImages(): Promise<void> {
    const images = await this.imageService.getImagesByPage('why-nio-far');

    const heroImg = images.find(img => img.section === 'hero');
    if (heroImg) this.heroImage.set(heroImg.image_url);

    const teamImg = images.find(img => img.section === 'team');
    if (teamImg) this.teamImage.set(teamImg.image_url);
  }
}
