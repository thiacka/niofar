import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="not-found-section">
      <div class="container">
        <div class="not-found-content">
          <div class="not-found-code">404</div>
          <h1>{{ lang.t('notFound.title') }}</h1>
          <p>{{ lang.t('notFound.text') }}</p>
          <a routerLink="/" class="btn btn-primary">{{ lang.t('notFound.cta') }}</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .not-found-section {
      min-height: calc(100vh - var(--header-height));
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: var(--header-height);
      background: var(--color-background);
    }

    .not-found-content {
      text-align: center;
      max-width: 500px;
      margin: 0 auto;
    }

    .not-found-code {
      font-family: var(--font-heading);
      font-size: 8rem;
      font-weight: 700;
      line-height: 1;
      color: var(--color-primary);
      opacity: 0.15;
      margin-bottom: var(--spacing-lg);
    }

    h1 {
      margin-bottom: var(--spacing-md);
    }

    p {
      color: var(--color-text-light);
      margin-bottom: var(--spacing-2xl);
      font-size: 1.1rem;
    }

    @media (max-width: 480px) {
      .not-found-code {
        font-size: 5rem;
      }
    }
  `]
})
export class NotFoundComponent {
  lang = inject(LanguageService);
}
