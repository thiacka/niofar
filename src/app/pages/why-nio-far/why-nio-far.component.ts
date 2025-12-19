import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-why-nio-far',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-hero">
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
            <h3>{{ lang.t('why.local') }}</h3>
            <p>We are based in Senegal and know every corner of our beautiful country. Our roots are here, and we share them with you.</p>
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
            <h3>{{ lang.t('why.guides') }}</h3>
            <p>Our guides are passionate locals with deep knowledge of Senegalese culture, history, and hidden gems.</p>
          </div>

          <div class="reason-card">
            <div class="reason-number">03</div>
            <div class="reason-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3>{{ lang.t('why.support') }}</h3>
            <p>From your first inquiry to your last day in Senegal, we are with you. Every trip is tailored to your dreams.</p>
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
            <h3>{{ lang.t('why.responsible') }}</h3>
            <p>We support local communities and practice sustainable tourism. Your visit makes a positive impact.</p>
          </div>

          <div class="reason-card featured">
            <div class="reason-number">05</div>
            <div class="reason-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h3>{{ lang.t('why.immersion') }}</h3>
            <p>No tourist traps, no superficial experiences. With NIO FAR, you live the real Senegal alongside its people.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="promise section" style="background: var(--color-background-alt);">
      <div class="container">
        <div class="promise-content">
          <div class="promise-image">
            <img src="https://images.pexels.com/photos/3889854/pexels-photo-3889854.jpeg?auto=compress&cs=tinysrgb&w=800" alt="NIO FAR promise" />
          </div>
          <div class="promise-text">
            <h2>Our Promise</h2>
            <p>When you travel with NIO FAR, you become part of our family. We don't just show you Senegal - we welcome you into it.</p>
            <p>Every journey is designed around you: your interests, your pace, your dreams. Whether you seek adventure, culture, relaxation, or all three, we create experiences that stay with you forever.</p>
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
      background: url('https://images.pexels.com/photos/5560532/pexels-photo-5560532.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat;
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
export class WhyNioFarComponent {
  lang = inject(LanguageService);
}
