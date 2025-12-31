import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { ContactService } from '../../core/services/contact.service';
import { ContactMessage } from '../../core/models/contact.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('nav.contact') }}</h1>
        <p>{{ lang.t('contact.title') }}</p>
      </div>
    </section>

    <section class="contact section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-form-wrapper">
            <form class="contact-form" (ngSubmit)="onSubmit()" #contactForm="ngForm">
              <div class="form-group">
                <label for="name">{{ lang.t('contact.name') }}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  [disabled]="isSubmitting()"
                />
              </div>

              <div class="form-group">
                <label for="email">{{ lang.t('contact.email') }}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  required
                  [disabled]="isSubmitting()"
                />
              </div>

              <div class="form-group">
                <label for="country">{{ lang.t('contact.country') }}</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  [(ngModel)]="formData.country"
                  required
                  [disabled]="isSubmitting()"
                />
              </div>

              <div class="form-group">
                <label for="message">{{ lang.t('contact.message') }}</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  [(ngModel)]="formData.message"
                  required
                  [disabled]="isSubmitting()"
                ></textarea>
              </div>

              @if (successMessage()) {
                <div class="alert alert-success">
                  {{ lang.t('contact.success') }}
                </div>
              }

              @if (errorMessage()) {
                <div class="alert alert-error">
                  {{ lang.t('contact.error') }}
                </div>
              }

              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="!contactForm.valid || isSubmitting()"
              >
                @if (isSubmitting()) {
                  <span class="spinner"></span>
                } @else {
                  {{ lang.t('contact.send') }}
                }
              </button>
            </form>
          </div>

          <div class="contact-info">
            <div class="info-card">
              <h3>{{ lang.t('contact.info') }}</h3>
              <div class="info-items">
                <div class="info-item">
                  <div class="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div class="info-content">
                    <span class="info-label">{{ lang.t('contact.whatsapp') }}</span>
                    <span class="info-value">+221 XX XXX XX XX</span>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Email</span>
                    <span class="info-value">contact&#64;niofar.com</span>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div class="info-content">
                    <span class="info-label">{{ lang.t('contact.location') }}</span>
                    <span class="info-value">Dakar, Senegal</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61803.41661080513!2d-17.509444!3d14.716677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec172f5b3c5bb71%3A0xb17c17d92d5f9356!2sDakar%2C%20Senegal!5e0!3m2!1sen!2sus!4v1703987600000!5m2!1sen!2sus"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              <a
                href="https://www.google.com/maps/place/Dakar,+Senegal/@14.716677,-17.509444,12z"
                target="_blank"
                rel="noopener"
                class="map-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                {{ lang.t('contact.viewMap') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-hero {
      position: relative;
      height: 40vh;
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url('https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat;
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
      margin-bottom: var(--spacing-sm);
    }

    .hero-content p {
      font-size: 1.125rem;
      opacity: 0.95;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-4xl);
    }

    .contact-form-wrapper {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-lg);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .form-group label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: 600;
      color: var(--color-text);
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: var(--spacing-md);
      border: 2px solid rgba(61, 43, 31, 0.15);
      border-radius: var(--radius-md);
      background: var(--color-background);
      transition: all var(--transition-fast);
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      background: var(--color-white);
    }

    .form-group input:disabled,
    .form-group textarea:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .form-group textarea {
      resize: vertical;
      min-height: 120px;
    }

    .alert {
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-lg);
    }

    .alert-success {
      background: rgba(74, 155, 109, 0.15);
      color: var(--color-success);
      border: 1px solid var(--color-success);
    }

    .alert-error {
      background: rgba(196, 91, 74, 0.15);
      color: var(--color-error);
      border: 1px solid var(--color-error);
    }

    .contact-form button {
      width: 100%;
    }

    .contact-form button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .info-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-md);
      margin-bottom: var(--spacing-xl);
    }

    .info-card h3 {
      margin-bottom: var(--spacing-xl);
      color: var(--color-text);
    }

    .info-items {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .info-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-white);
      flex-shrink: 0;
    }

    .info-content {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-size: 0.85rem;
      color: var(--color-text-light);
    }

    .info-value {
      font-weight: 600;
      color: var(--color-text);
    }

    .map-container {
      position: relative;
      border-radius: var(--radius-xl);
      overflow: hidden;
      height: 250px;
      background: var(--color-background);
    }

    .map-container iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .map-link {
      position: absolute;
      bottom: var(--spacing-md);
      right: var(--spacing-md);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      background: var(--color-white);
      color: var(--color-primary);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-fast);
    }

    .map-link:hover {
      background: var(--color-primary);
      color: var(--color-white);
    }

    @media (max-width: 992px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {
  lang = inject(LanguageService);
  private contactService = inject(ContactService);

  formData: ContactMessage = {
    name: '',
    email: '',
    country: '',
    message: ''
  };

  isSubmitting = signal(false);
  successMessage = signal(false);
  errorMessage = signal(false);

  async onSubmit(): Promise<void> {
    this.isSubmitting.set(true);
    this.successMessage.set(false);
    this.errorMessage.set(false);

    const result = await this.contactService.sendMessage(this.formData);

    this.isSubmitting.set(false);

    if (result.success) {
      this.successMessage.set(true);
      this.formData = {
        name: '',
        email: '',
        country: '',
        message: ''
      };
    } else {
      this.errorMessage.set(true);
    }
  }
}
