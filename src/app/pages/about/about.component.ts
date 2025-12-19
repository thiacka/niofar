import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('about.title') }}</h1>
      </div>
    </section>

    <section class="about-intro section">
      <div class="container">
        <div class="about-grid">
          <div class="about-image">
            <img src="https://images.pexels.com/photos/5560532/pexels-photo-5560532.jpeg?auto=compress&cs=tinysrgb&w=800" alt="NIO FAR team" />
          </div>
          <div class="about-text">
            <p class="lead">{{ lang.t('about.text1') }}</p>
            <p>{{ lang.t('about.text2') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="values section" style="background: var(--color-background-alt);">
      <div class="container">
        <div class="section-title">
          <h2>{{ lang.t('about.values.title') }}</h2>
        </div>
        <div class="values-grid">
          <div class="value-item">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <h3>{{ lang.t('about.values.authenticity') }}</h3>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3>{{ lang.t('about.values.respect') }}</h3>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
            </div>
            <h3>{{ lang.t('about.values.expertise') }}</h3>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>{{ lang.t('about.values.hospitality') }}</h3>
          </div>
        </div>
      </div>
    </section>

    <section class="closing section">
      <div class="container">
        <div class="closing-content">
          <blockquote>
            <p>{{ lang.t('about.closing') }}</p>
          </blockquote>
          <a routerLink="/contact" class="btn btn-primary">{{ lang.t('hero.cta') }}</a>
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
      background: url('https://images.pexels.com/photos/3889854/pexels-photo-3889854.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat;
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

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-4xl);
      align-items: center;
    }

    .about-image {
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .about-image img {
      width: 100%;
      height: 450px;
      object-fit: cover;
    }

    .about-text .lead {
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--color-text);
      margin-bottom: var(--spacing-lg);
    }

    .about-text p {
      color: var(--color-text-light);
      line-height: 1.8;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-xl);
    }

    .value-item {
      text-align: center;
      padding: var(--spacing-2xl) var(--spacing-lg);
      background: var(--color-white);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      transition: all var(--transition-base);
    }

    .value-item:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .value-icon {
      color: var(--color-secondary);
      margin-bottom: var(--spacing-lg);
    }

    .value-item h3 {
      font-size: 1rem;
      font-family: var(--font-body);
      font-weight: 600;
    }

    .closing-content {
      text-align: center;
      max-width: 700px;
      margin: 0 auto;
    }

    blockquote {
      margin-bottom: var(--spacing-2xl);
    }

    blockquote p {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-style: italic;
      color: var(--color-text);
      line-height: 1.6;
    }

    @media (max-width: 992px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-2xl);
      }

      .values-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .values-grid {
        grid-template-columns: 1fr;
      }

      blockquote p {
        font-size: 1.25rem;
      }
    }
  `]
})
export class AboutComponent {
  lang = inject(LanguageService);
}
