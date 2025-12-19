import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('experiences.title') }}</h1>
        <p>{{ lang.t('experiences.subtitle') }}</p>
      </div>
    </section>

    <section class="experiences section">
      <div class="container">
        <div class="experience-grid">
          <div class="experience-card">
            <div class="experience-image">
              <img src="https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Cultural encounters" />
            </div>
            <div class="experience-content">
              <div class="experience-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>{{ lang.t('experiences.cultural') }}</h3>
              <p>Meet local artisans, musicians, and families. Share meals, stories, and traditions that have been passed down through generations.</p>
            </div>
          </div>

          <div class="experience-card">
            <div class="experience-image">
              <img src="https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Nature wildlife" />
            </div>
            <div class="experience-content">
              <div class="experience-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>{{ lang.t('experiences.nature') }}</h3>
              <p>Explore breathtaking landscapes, from the pink waters of Lake Retba to the lush mangroves of the Sine-Saloum Delta.</p>
            </div>
          </div>

          <div class="experience-card">
            <div class="experience-image">
              <img src="https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Local traditions" />
            </div>
            <div class="experience-content">
              <div class="experience-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h3>{{ lang.t('experiences.traditions') }}</h3>
              <p>Witness traditional ceremonies, learn about Wolof customs, and participate in authentic village celebrations.</p>
            </div>
          </div>

          <div class="experience-card">
            <div class="experience-image">
              <img src="https://images.pexels.com/photos/3889891/pexels-photo-3889891.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Senegalese lifestyle" />
            </div>
            <div class="experience-content">
              <div class="experience-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </div>
              <h3>{{ lang.t('experiences.lifestyle') }}</h3>
              <p>Live the Teranga spirit. Experience the warmth and hospitality that makes Senegal truly special.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="gallery section" style="background: var(--color-background-alt);">
      <div class="container">
        <div class="section-title">
          <h2>Gallery</h2>
        </div>
        <div class="gallery-grid">
          <div class="gallery-item large">
            <img src="https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Senegal sunset" />
          </div>
          <div class="gallery-item">
            <img src="https://images.pexels.com/photos/5560549/pexels-photo-5560549.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Senegal nature" />
          </div>
          <div class="gallery-item">
            <img src="https://images.pexels.com/photos/3889854/pexels-photo-3889854.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Local culture" />
          </div>
          <div class="gallery-item">
            <img src="https://images.pexels.com/photos/3889827/pexels-photo-3889827.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Village life" />
          </div>
          <div class="gallery-item">
            <img src="https://images.pexels.com/photos/5560532/pexels-photo-5560532.jpeg?auto=compress&cs=tinysrgb&w=600" alt="People of Senegal" />
          </div>
        </div>
      </div>
    </section>

    <section class="closing section">
      <div class="container">
        <div class="closing-content">
          <blockquote>
            <p>{{ lang.t('experiences.closing') }}</p>
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
      background: url('https://images.pexels.com/photos/3889891/pexels-photo-3889891.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat;
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
      margin-bottom: var(--spacing-md);
    }

    .hero-content p {
      font-size: 1.125rem;
      opacity: 0.95;
      max-width: 600px;
      margin: 0 auto;
    }

    .experience-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-2xl);
    }

    .experience-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-base);
    }

    .experience-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .experience-image img {
      width: 100%;
      height: 250px;
      object-fit: cover;
    }

    .experience-content {
      padding: var(--spacing-xl);
    }

    .experience-icon {
      color: var(--color-secondary);
      margin-bottom: var(--spacing-md);
    }

    .experience-content h3 {
      margin-bottom: var(--spacing-md);
    }

    .experience-content p {
      color: var(--color-text-light);
      margin: 0;
      line-height: 1.7;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 200px);
      gap: var(--spacing-md);
    }

    .gallery-item {
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .gallery-item.large {
      grid-column: span 2;
      grid-row: span 2;
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .gallery-item:hover img {
      transform: scale(1.05);
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
      .experience-grid {
        grid-template-columns: 1fr;
      }

      .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
      }

      .gallery-item.large {
        grid-column: span 2;
        grid-row: span 1;
      }
    }

    @media (max-width: 480px) {
      .gallery-grid {
        grid-template-columns: 1fr;
      }

      .gallery-item.large {
        grid-column: span 1;
      }

      blockquote p {
        font-size: 1.25rem;
      }
    }
  `]
})
export class ExperiencesComponent {
  lang = inject(LanguageService);
}
