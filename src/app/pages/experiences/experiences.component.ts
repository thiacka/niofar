import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { PageImageService } from '../../core/services/page-image.service';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-hero" [style.background-image]="'url(' + heroImage() + ')'">
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
              <img [src]="cultureImage()" alt="Cultural encounters" />
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
              <h3>{{ lang.t('experiences.cultural.title') }}</h3>
              <p>{{ lang.t('experiences.cultural.text') }}</p>
            </div>
          </div>

          <div class="experience-card">
            <div class="experience-image">
              <img [src]="natureImage()" alt="Nature wildlife" />
            </div>
            <div class="experience-content">
              <div class="experience-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>{{ lang.t('experiences.nature.title') }}</h3>
              <p>{{ lang.t('experiences.nature.text') }}</p>
            </div>
          </div>

          <div class="experience-card">
            <div class="experience-image">
              <img [src]="gastronomyImage()" alt="Local traditions" />
            </div>
            <div class="experience-content">
              <div class="experience-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h3>{{ lang.t('experiences.traditions.title') }}</h3>
              <p>{{ lang.t('experiences.traditions.text') }}</p>
            </div>
          </div>

          <div class="experience-card">
            <div class="experience-image">
              <img src="https://media.istockphoto.com/id/1399319461/fr/photo/touriste-gar%C3%A7on-et-bateau-bateau-de-p%C3%AAche-au-march%C3%A9-soumbedioune-dakar-s%C3%A9n%C3%A9gal-afrique.jpg?s=612x612&w=0&k=20&c=F6m28zFsRhvCB8jLazMrS4v4QW9jLKDdHAUo8DUy-dY=" alt="Senegalese lifestyle" />
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
              <h3>{{ lang.t('experiences.lifestyle.title') }}</h3>
              <p>{{ lang.t('experiences.lifestyle.text') }}</p>
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
            <img src="https://media.istockphoto.com/id/2257948949/fr/photo/la-silhouette-de-l%C3%AEle-joal-fadiouth-avec-%C3%A9glise-et-mosqu%C3%A9e-s%C3%A9n%C3%A9gal.jpg?s=612x612&w=0&k=20&c=38iGOMX9QLjVXWwNG0JuUAXsIFkZwdKwaSeCPv3lJ3k=" alt="Senegal sunset" />
          </div>
          <div class="gallery-item">
            <img src="https://media.istockphoto.com/id/2238524706/fr/photo/baobab-tress-et-village.jpg?s=612x612&w=0&k=20&c=v84M6g6W27QvTBLe8aYx9vTzwutWugIHmWKTna5hSLc=" alt="Senegal nature" />
          </div>
          <div class="gallery-item">
            <img src="https://media.istockphoto.com/id/615491898/fr/photo/porte-dentr%C3%A9e-du-parc-naturel-de-bandia-au-s%C3%A9n%C3%A9gal.jpg?s=612x612&w=0&k=20&c=pdgbMx6oJLTUap9VHWZBT0YRGN974z42e09Vclb-h1U=" alt="Local culture" />
          </div>
          <div class="gallery-item">
            <img src="https://media.istockphoto.com/id/1039841242/fr/photo/homme-non-identifi%C3%A9-de-diola-dans-un-costume-de-foin-se-d%C3%A9place-au-cours-dune-danse.jpg?s=612x612&w=0&k=20&c=SageibHHel3p9so3fGyu9EC_Lz-rzIFyhcTaPKV2Ojk=" alt="Village life" />
          </div>
          <div class="gallery-item">
            <img src="https://media.istockphoto.com/id/2193209851/fr/photo/bateau-dans-le-lac-retba-lac-rose-proche-dakar-s%C3%A9n%C3%A9gal-afrique-de-louest.jpg?s=612x612&w=0&k=20&c=_d9VaAH2eJvkrnabSXwbI5JLNj8uni54DA_-eI6N_Eo=" alt="People of Senegal" />
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
export class ExperiencesComponent implements OnInit {
  lang = inject(LanguageService);
  private imageService = inject(PageImageService);

  heroImage = signal('https://media.istockphoto.com/id/1179642381/fr/photo/silhouette-de-baobab.jpg?s=612x612&w=0&k=20&c=JTZmggPXIKGc0-1KT_4rLRgK4WwgcLGcw-MSoOOR1mc=');
  cultureImage = signal('https://media.istockphoto.com/id/482455561/fr/photo/march%C3%A9-afrique.jpg?s=612x612&w=0&k=20&c=uO8GSzhHc7WC5RBAvXZE4tDCfle_GnfxMQtP33-k3AM=');
  natureImage = signal('https://media.istockphoto.com/id/2176188076/fr/photo/troupeau-dimpalas-broutant-dans-la-savane.jpg?s=612x612&w=0&k=20&c=M5CCkJaAptZbrZsZA3g6PcSsa2BdzkY6n4k-9kHYCZE=');
  gastronomyImage = signal('https://media.istockphoto.com/id/2190163215/fr/photo/faux-lions-danse-nationale-des-masques-au-s%C3%A9n%C3%A9gal-afrique-de-louest.jpg?s=612x612&w=0&k=20&c=QAwznwjgWUREdbRHOaUejeMT94r3kOLH7tcFiDXXWwE=');

  ngOnInit(): void {
    this.loadImages();
  }

  async loadImages(): Promise<void> {
    const images = await this.imageService.getImagesByPage('experiences');

    const heroImg = images.find(img => img.section === 'hero');
    if (heroImg) this.heroImage.set(heroImg.image_url);

    const cultureImg = images.find(img => img.section === 'culture');
    if (cultureImg) this.cultureImage.set(cultureImg.image_url);

    const natureImg = images.find(img => img.section === 'nature');
    if (natureImg) this.natureImage.set(natureImg.image_url);

    const gastronomyImg = images.find(img => img.section === 'gastronomy');
    if (gastronomyImg) this.gastronomyImage.set(gastronomyImg.image_url);
  }
}
