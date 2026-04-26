import { Component, inject, signal, OnInit, computed, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { ExcursionService, Excursion } from '../../core/services/excursion.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { Circuit, CircuitService, ItineraryDay, CircuitAttachment } from '../../core/services/circuit.service';
import { CurrencyConverterPipe } from '../../shared/pipes/currency-converter.pipe';
import { SeoService } from '../../core/services/seo.service';

interface DayWithImage extends ItineraryDay {
  excursion_image?: string;
  images?: string[];
}

interface LightboxState {
  images: string[];
  index: number;
  title: string;
  totalImages: number;
}

@Component({
  selector: 'app-circuit-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollAnimateDirective, CurrencyConverterPipe],
  template: `
    <section class="page-hero" [style.background-image]="'url(' + (circuit()?.image_url || '') + ')'">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        @if (circuit()) {
          <div class="hero-breadcrumb">
            <a routerLink="/circuits">{{ lang.t('circuits.title') }}</a>
            <span>/</span>
            <span>{{ getTitle() }}</span>
          </div>
          <h1>{{ getTitle() }}</h1>
          <div class="hero-meta">
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ getDuration() }}
            </div>
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Senegal
            </div>
          </div>
        }
      </div>
    </section>

    @if (isLoading()) {
      <section class="section">
        <div class="container">
          <div class="loading">
            <div class="spinner"></div>
          </div>
        </div>
      </section>
    } @else if (circuit()) {
      <section class="circuit-overview section">
        <div class="container">
          <div class="overview-grid">
            <div class="overview-content" appScrollAnimate>
              <h2>{{ lang.t('circuits.overview') }}</h2>
              <p class="lead">{{ getDescription() }}</p>

              <div class="highlights-section">
                <h3>{{ lang.t('circuits.highlights') }}</h3>
                <ul class="highlights-list">
                  @for (highlight of getHighlights(); track highlight) {
                    <li>{{ highlight }}</li>
                  }
                </ul>
              </div>
            </div>

            <div class="overview-sidebar" appScrollAnimate [animationDelay]="200">
              <div class="price-card">
                <div class="price-header">
                  <span class="price-label">{{ lang.t('circuits.from') }}</span>
                  <div class="price-value">{{ circuit()!.price | currencyConverter }}</div>
                  <span class="price-note">{{ getPriceNote() }}</span>
                </div>
                <a [routerLink]="['/booking', circuit()!.slug]" class="btn btn-primary btn-large">
                  {{ lang.t('circuits.book') }}
                </a>
              </div>

              <div class="info-card">
                <h4>{{ lang.t('booking.included') }}</h4>
                <ul class="included-list">
                  @for (service of getIncludedServices(); track service) {
                    <li>{{ service }}</li>
                  }
                </ul>
              </div>

              @if (attachments().length > 0) {
                <div class="info-card attachments-card">
                  <h4>{{ lang.t('circuits.attachments') }}</h4>
                  <div class="attachments-list-public">
                    @for (att of attachments(); track att.id) {
                      <a [href]="att.file_url" target="_blank" class="attachment-link">
                        <div class="att-icon-wrap">
                          @if (att.file_type.startsWith('image/')) {
                            <img [src]="att.file_url" [alt]="att.file_name" class="att-thumb" loading="lazy" />
                          } @else {
                            <div class="att-pdf-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                              </svg>
                            </div>
                          }
                        </div>
                        <div class="att-details">
                          <span class="att-name">{{ att.file_name }}</span>
                          <span class="att-action">{{ lang.t('circuits.downloadFile') }}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="att-arrow">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </a>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      @if (itineraryDays().length > 0) {
        <section class="itinerary-section section" style="background: var(--color-background-alt);">
          <div class="container">
            <div class="section-header" appScrollAnimate>
              <h2>{{ lang.t('circuits.itinerary') }}</h2>
              <p>{{ lang.t('circuits.itinerarySubtitle') }}</p>
            </div>

            <div class="itinerary-timeline">
              @for (day of itineraryDays(); track day.day; let dayIndex = $index; let isLast = $last) {
                <div class="day-card" appScrollAnimate [animationDelay]="dayIndex * 100">
                  <div class="day-card-inner">
                    <div class="day-image-section">
                      @let imgs = getStepImages(day, circuit()!.image_url);

                      <img
                        [src]="getActiveStepImage(day, circuit()!.image_url)"
                        [alt]="getDayTitle(day)"
                        class="day-image"
                        loading="lazy"
                        decoding="async"
                        (click)="openLightbox(day, circuit()!.image_url, getActiveIndex(day))"
                      />

                      <!-- Bouton agrandir -->
                      <button
                        class="img-expand-btn"
                        (click)="openLightbox(day, circuit()!.image_url, getActiveIndex(day)); $event.stopPropagation()"
                        aria-label="Voir en grand"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                        </svg>
                      </button>

                      <div class="day-badge">
                        <span class="day-label">{{ lang.t('circuits.day') }}</span>
                        <span class="day-number-large">{{ day.day }}</span>
                      </div>

                      @if (imgs.length > 1) {
                        <button class="img-nav img-nav-prev" (click)="prevStepImage(day, circuit()!.image_url); $event.stopPropagation()" aria-label="Image précédente">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="15 18 9 12 15 6"/>
                          </svg>
                        </button>
                        <button class="img-nav img-nav-next" (click)="nextStepImage(day, circuit()!.image_url); $event.stopPropagation()" aria-label="Image suivante">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </button>
                        <div class="img-dots">
                          @for (img of imgs; track $index) {
                            <button
                              class="img-dot"
                              [class.active]="getActiveIndex(day) === $index"
                              (click)="setActiveStepImage(day, $index); $event.stopPropagation()"
                              [attr.aria-label]="'Image ' + ($index + 1)"
                            ></button>
                          }
                        </div>
                      }
                    </div>

                    <div class="day-content-section">
                      <div class="day-header-content">
                        <h3 class="day-title">{{ getDayTitle(day) }}</h3>
                        @if (getDayLocation(day)) {
                          <div class="day-location">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>{{ getDayLocation(day) }}</span>
                          </div>
                        }
                      </div>

                      <p class="day-description">{{ getDayDescription(day) }}</p>

                      <div class="day-details-grid">
                        @if (getDayAccommodation(day)) {
                          <div class="day-detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                              <path d="M3 9V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"/>
                              <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/>
                            </svg>
                            <div>
                              <span class="detail-label">{{ lang.t('booking.accommodation') }}</span>
                              <span class="detail-value">{{ getDayAccommodation(day) }}</span>
                            </div>
                          </div>
                        }

                        @if (getDayMeals(day)) {
                          <div class="day-detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2"/>
                              <path d="M6 8h8"/>
                              <path d="M6 12h8"/>
                              <path d="M6 16h8"/>
                              <path d="M2 8h2"/>
                              <path d="M2 12h2"/>
                              <path d="M2 16h2"/>
                            </svg>
                            <div>
                              <span class="detail-label">{{ lang.t('booking.meals') }}</span>
                              <span class="detail-value">{{ getDayMeals(day) }}</span>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>

                  @if (!isLast) {
                    <div class="day-connector">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </section>
      }

      <!-- ══ LIGHTBOX ══════════════════════════════════════════════════════════ -->
      @if (lightbox()) {
        <div class="lightbox-overlay" (click)="closeLightbox()" role="dialog" aria-modal="true">
          <div class="lightbox-inner" (click)="$event.stopPropagation()">

            <!-- En-tête -->
            <div class="lightbox-header">
              <div class="lightbox-title">
                <span class="lightbox-day-label">{{ lightbox()!.title }}</span>
                <span class="lightbox-counter">{{ lightbox()!.index + 1 }} / {{ lightbox()!.totalImages }}</span>
              </div>
              <button class="lightbox-close" (click)="closeLightbox()" aria-label="Fermer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Image principale -->
            <div class="lightbox-stage">
              @if (lightbox()!.totalImages > 1) {
                <button class="lightbox-nav lightbox-prev" (click)="lightboxPrev()" aria-label="Précédent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
              }

              <div class="lightbox-img-wrap">
                <img
                  [src]="lightbox()!.images[lightbox()!.index]"
                  [alt]="lightbox()!.title"
                  class="lightbox-img"
                />
              </div>

              @if (lightbox()!.totalImages > 1) {
                <button class="lightbox-nav lightbox-next" (click)="lightboxNext()" aria-label="Suivant">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              }
            </div>

            <!-- Vignettes -->
            @if (lightbox()!.totalImages > 1) {
              <div class="lightbox-thumbs">
                @for (img of lightbox()!.images; track $index) {
                  <button
                    class="lightbox-thumb"
                    [class.active]="lightbox()!.index === $index"
                    (click)="lightboxGoTo($index)"
                    [attr.aria-label]="'Image ' + ($index + 1)"
                  >
                    <img [src]="img" [alt]="'Photo ' + ($index + 1)" loading="lazy" />
                  </button>
                }
              </div>
            }

          </div>
        </div>
      }

      <section class="share-section section">
        <div class="container">
          <div class="share-content" appScrollAnimate>
            <span class="share-label">{{ lang.t('share.title') }}</span>
            <div class="share-buttons">
              <button class="share-btn share-whatsapp" (click)="shareWhatsApp()" title="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L0 24l6.335-1.502A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.787 9.787 0 0 1-5.032-1.388l-.361-.214-3.741.887.938-3.64-.235-.374A9.778 9.778 0 0 1 2.182 12C2.182 6.566 6.566 2.182 12 2.182S21.818 6.566 21.818 12 17.434 21.818 12 21.818z"/>
                </svg>
                WhatsApp
              </button>
              <button class="share-btn share-facebook" (click)="shareFacebook()" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                Facebook
              </button>
              <button class="share-btn share-twitter" (click)="shareTwitter()" title="X / Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </button>
              <button class="share-btn share-copy" (click)="copyLink()" title="Copy link">
                @if (linkCopied()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ lang.t('share.copied') }}
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  {{ lang.language() === 'fr' ? 'Copier le lien' : 'Copy link' }}
                }
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="container">
          <div class="cta-content" appScrollAnimate>
            <h2>{{ lang.t('circuits.readyToBook') }}</h2>
            <p>{{ lang.t('circuits.bookingCta') }}</p>
            <a [routerLink]="['/booking', circuit()!.slug]" class="btn btn-accent btn-large">
              {{ lang.t('circuits.bookNow') }}
            </a>
          </div>
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container">
          <div class="not-found">
            <h2>{{ lang.t('circuits.notFound') }}</h2>
            <a routerLink="/circuits" class="btn btn-primary">{{ lang.t('circuits.backToCircuits') }}</a>
          </div>
        </div>
      </section>
    }
  `,
  styles: [`
    .page-hero {
      position: relative;
      height: 60vh;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: cover;
      background-position: center;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(61, 43, 31, 0.85), rgba(43, 138, 138, 0.6));
    }

    .hero-content {
      position: relative;
      text-align: center;
      color: var(--color-white);
      padding-top: var(--header-height);
    }

    .hero-breadcrumb {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .hero-breadcrumb a {
      color: var(--color-white);
      transition: opacity var(--transition-fast);
    }

    .hero-breadcrumb a:hover {
      opacity: 0.7;
    }

    .hero-content h1 {
      color: var(--color-white);
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
      margin-bottom: var(--spacing-lg);
      font-size: 3rem;
    }

    .hero-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xl);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 1.1rem;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: var(--spacing-4xl);
    }

    .overview-content .lead {
      font-size: 1.2rem;
      line-height: 1.8;
      color: var(--color-text-light);
      margin-bottom: var(--spacing-2xl);
    }

    .highlights-section h3 {
      margin-bottom: var(--spacing-lg);
      color: var(--color-primary);
    }

    .highlights-list {
      list-style: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
    }

    .highlights-list li {
      position: relative;
      padding-left: var(--spacing-lg);
      color: var(--color-text);
    }

    .highlights-list li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-accent);
    }

    .overview-sidebar {
      position: sticky;
      top: calc(var(--header-height) + var(--spacing-lg));
      align-self: start;
    }

    .price-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-xl);
      margin-bottom: var(--spacing-lg);
    }

    .price-header {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .price-label {
      display: block;
      font-size: 0.9rem;
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--spacing-sm);
    }

    .price-value {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1.2;
    }

    .currency {
      font-size: 1.5rem;
    }

    .price-note {
      display: block;
      font-size: 0.85rem;
      color: var(--color-text-light);
      margin-top: var(--spacing-sm);
    }

    .btn-large {
      width: 100%;
      padding: var(--spacing-lg);
      font-size: 1.1rem;
    }

    .info-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
    }

    .info-card h4 {
      margin-bottom: var(--spacing-lg);
      color: var(--color-text);
    }

    .included-list {
      list-style: none;
      padding: 0;
    }

    .included-list li {
      position: relative;
      padding-left: var(--spacing-lg);
      margin-bottom: var(--spacing-sm);
      color: var(--color-text);
      font-size: 0.95rem;
    }

    .included-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--color-success);
      font-weight: 700;
    }

    .section-header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto var(--spacing-4xl);
    }

    .section-header h2 {
      margin-bottom: var(--spacing-md);
    }

    .section-header p {
      color: var(--color-text-light);
      font-size: 1.1rem;
    }

    .itinerary-timeline {
      max-width: 1100px;
      margin: 0 auto;
    }

    .day-card {
      position: relative;
      margin-bottom: var(--spacing-3xl);
    }

    .day-card-inner {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 0;
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      transition: transform var(--transition-base), box-shadow var(--transition-base);
    }

    .day-card-inner:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(61, 43, 31, 0.15);
    }

    .day-image-section {
      position: relative;
      overflow: hidden;
    }

    .day-image {
      width: 100%;
      height: 100%;
      min-height: 350px;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .day-card-inner:hover .day-image {
      transform: scale(1.05);
    }

    /* ── Curseur zoom sur l'image ── */
    .day-image {
      cursor: zoom-in;
    }

    /* ── Bouton agrandir ── */
    .img-expand-btn {
      position: absolute;
      top: var(--spacing-md);
      right: var(--spacing-md);
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-primary);
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      transition: background var(--transition-fast), transform var(--transition-fast);
      z-index: 5;
      opacity: 0;
    }

    .day-image-section:hover .img-expand-btn {
      opacity: 1;
    }

    .img-expand-btn:hover {
      background: var(--color-white);
      transform: scale(1.1);
    }

    /* ── Galerie navigation ── */
    .img-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-primary);
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      transition: background var(--transition-fast), transform var(--transition-fast);
      z-index: 5;
      opacity: 0;
    }

    .day-image-section:hover .img-nav {
      opacity: 1;
    }

    .img-nav:hover {
      background: var(--color-white);
      transform: translateY(-50%) scale(1.1);
    }

    .img-nav-prev { left: var(--spacing-md); }
    .img-nav-next { right: var(--spacing-md); }

    .img-dots {
      position: absolute;
      bottom: var(--spacing-md);
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      z-index: 5;
    }

    .img-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.8);
      background: transparent;
      cursor: pointer;
      transition: background var(--transition-fast), transform var(--transition-fast);
      padding: 0;
    }

    .img-dot.active {
      background: var(--color-white);
      transform: scale(1.3);
    }

    .img-dot:hover:not(.active) {
      background: rgba(255,255,255,0.6);
    }

    .day-badge {
      position: absolute;
      top: var(--spacing-lg);
      left: var(--spacing-lg);
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: var(--color-white);
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs);
      min-width: 70px;
    }

    .day-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.9;
      font-weight: 600;
    }

    .day-number-large {
      font-family: var(--font-heading);
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
    }

    .day-content-section {
      padding: var(--spacing-2xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .day-header-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .day-title {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      color: var(--color-primary);
      font-weight: 700;
      line-height: 1.3;
      margin: 0;
    }

    .day-location {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: var(--color-secondary);
      font-weight: 600;
      font-size: 0.95rem;
    }

    .day-location svg {
      flex-shrink: 0;
    }

    .day-description {
      color: var(--color-text);
      line-height: 1.8;
      font-size: 1rem;
      margin: 0;
    }

    .day-details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
      padding-top: var(--spacing-lg);
      border-top: 2px solid var(--color-background-alt);
    }

    .day-detail-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .day-detail-item svg {
      flex-shrink: 0;
      color: var(--color-accent);
      margin-top: 2px;
    }

    .day-detail-item > div {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .detail-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-light);
      font-weight: 600;
    }

    .detail-value {
      font-size: 0.95rem;
      color: var(--color-text);
      font-weight: 500;
    }

    .day-connector {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;
      color: var(--color-secondary);
      opacity: 0.5;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .share-section {
      padding: var(--spacing-xl) 0;
      border-top: 1px solid rgba(61,43,31,0.1);
    }

    .share-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-xl);
      flex-wrap: wrap;
    }

    .share-label {
      font-weight: 600;
      color: var(--color-text-light);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    .share-buttons {
      display: flex;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
    }

    .share-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: var(--color-white);
    }

    .share-whatsapp { background: #25D366; }
    .share-whatsapp:hover { background: #128C7E; }
    .share-facebook { background: #1877F2; }
    .share-facebook:hover { background: #166FE5; }
    .share-twitter { background: #000; }
    .share-twitter:hover { background: #333; }
    .share-copy {
      background: var(--color-background-alt);
      color: var(--color-text);
      border: 1px solid rgba(61,43,31,0.2);
    }
    .share-copy:hover { background: var(--color-primary); color: var(--color-white); border-color: var(--color-primary); }

    .cta-section {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      padding: var(--spacing-4xl) 0;
    }

    .cta-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-content h2 {
      color: var(--color-white);
      margin-bottom: var(--spacing-md);
    }

    .cta-content p {
      color: var(--color-white);
      opacity: 0.95;
      font-size: 1.1rem;
      margin-bottom: var(--spacing-xl);
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: var(--spacing-4xl);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(61, 43, 31, 0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .attachments-card {
      margin-top: var(--spacing-lg);
    }

    .attachments-list-public {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .attachment-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: var(--color-text);
      transition: background var(--transition-fast);
      border: 1px solid rgba(61, 43, 31, 0.1);
    }

    .attachment-link:hover {
      background: var(--color-background-alt);
      border-color: var(--color-primary);
    }

    .att-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      flex-shrink: 0;
    }

    .att-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .att-pdf-icon {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(196, 91, 74, 0.1);
      color: var(--color-error);
    }

    .att-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .att-name {
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .att-action {
      font-size: 0.75rem;
      color: var(--color-secondary);
      font-weight: 600;
    }

    .att-arrow {
      flex-shrink: 0;
      color: var(--color-text-light);
      transition: color var(--transition-fast);
    }

    .attachment-link:hover .att-arrow {
      color: var(--color-primary);
    }

    .not-found {
      text-align: center;
      padding: var(--spacing-4xl);
    }

    .not-found h2 {
      margin-bottom: var(--spacing-xl);
      color: var(--color-text-light);
    }

    @media (max-width: 992px) {
      .overview-grid {
        grid-template-columns: 1fr;
      }

      .overview-sidebar {
        position: static;
      }

      .highlights-list {
        grid-template-columns: 1fr;
      }

      .hero-content h1 {
        font-size: 2rem;
      }

      .day-card-inner {
        grid-template-columns: 1fr;
      }

      .day-image-section {
        min-height: 280px;
      }

      .day-image {
        min-height: 280px;
      }

      .day-title {
        font-size: 1.5rem;
      }

      .day-content-section {
        padding: var(--spacing-xl);
      }
    }

    @media (max-width: 600px) {
      .day-badge {
        top: var(--spacing-md);
        left: var(--spacing-md);
        padding: var(--spacing-sm) var(--spacing-md);
        min-width: 60px;
      }

      .day-label {
        font-size: 0.65rem;
      }

      .day-number-large {
        font-size: 1.5rem;
      }

      .day-title {
        font-size: 1.3rem;
      }

      .day-content-section {
        padding: var(--spacing-lg);
      }

      .day-details-grid {
        grid-template-columns: 1fr;
      }

      .day-connector {
        height: 40px;
      }
    }

    /* ══ LIGHTBOX ═══════════════════════════════════════════════════════════ */

    .lightbox-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.92);
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: lb-fade-in 0.2s ease;
    }

    @keyframes lb-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .lightbox-inner {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      max-width: 1200px;
      padding: var(--spacing-md) var(--spacing-xl);
      gap: var(--spacing-md);
    }

    .lightbox-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .lightbox-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .lightbox-day-label {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--color-white);
    }

    .lightbox-counter {
      font-size: 0.9rem;
      color: rgba(255,255,255,0.55);
      font-weight: 500;
    }

    .lightbox-close {
      background: rgba(255,255,255,0.1);
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-white);
      cursor: pointer;
      transition: background var(--transition-fast);
      flex-shrink: 0;
    }

    .lightbox-close:hover {
      background: rgba(255,255,255,0.22);
    }

    .lightbox-stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-md);
      min-height: 0;
      position: relative;
    }

    .lightbox-img-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 0;
      min-width: 0;
    }

    .lightbox-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: var(--radius-lg);
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
      animation: lb-img-in 0.25s ease;
      display: block;
    }

    @keyframes lb-img-in {
      from { opacity: 0; transform: scale(0.96); }
      to   { opacity: 1; transform: scale(1); }
    }

    .lightbox-nav {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      width: 52px;
      height: 52px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-white);
      cursor: pointer;
      transition: background var(--transition-fast), transform var(--transition-fast);
    }

    .lightbox-nav:hover {
      background: rgba(255,255,255,0.25);
      transform: scale(1.08);
    }

    .lightbox-thumbs {
      display: flex;
      justify-content: center;
      gap: var(--spacing-sm);
      flex-shrink: 0;
      padding-bottom: var(--spacing-sm);
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.2) transparent;
    }

    .lightbox-thumb {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 2px solid transparent;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
      transition: border-color var(--transition-fast), transform var(--transition-fast);
      background: none;
      opacity: 0.55;
    }

    .lightbox-thumb.active {
      border-color: var(--color-white);
      opacity: 1;
      transform: scale(1.08);
    }

    .lightbox-thumb:hover:not(.active) {
      opacity: 0.85;
    }

    .lightbox-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    @media (max-width: 600px) {
      .lightbox-inner {
        padding: var(--spacing-sm) var(--spacing-md);
      }
      .lightbox-nav {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .lightbox-prev { left: var(--spacing-sm); }
      .lightbox-next { right: var(--spacing-sm); }
      .lightbox-nav:hover { transform: translateY(-50%) scale(1.08); }
      .lightbox-thumb { width: 56px; height: 56px; }
      .lightbox-day-label { font-size: 1rem; }
    }
  `]
})
export class CircuitDetailComponent implements OnInit {
  lang = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private circuitService = inject(CircuitService);
  private excursionService = inject(ExcursionService);
  private seo = inject(SeoService);

  circuit = signal<Circuit | null>(null);
  itineraryDays = signal<DayWithImage[]>([]);
  attachments = signal<CircuitAttachment[]>([]);
  isLoading = signal(true);
  linkCopied = signal(false);
  dayActiveImageIndex = signal<Map<number, number>>(new Map());
  lightbox = signal<LightboxState | null>(null);

  // ── Navigation clavier ────────────────────────────────────────────────────
  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    const lb = this.lightbox();
    if (!lb) return;
    if (e.key === 'Escape') { this.closeLightbox(); }
    else if (e.key === 'ArrowLeft')  { this.lightboxPrev(); }
    else if (e.key === 'ArrowRight') { this.lightboxNext(); }
  }

  shareWhatsApp(): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      this.lang.language() === 'fr'
        ? `Découvrez ce circuit au Sénégal avec NIO FAR : ${window.location.href}`
        : `Discover this Senegal tour with NIO FAR: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  shareFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  }

  shareTwitter(): void {
    const c = this.circuit();
    const title = c ? (this.lang.language() === 'fr' ? c.title_fr : c.title_en) : 'NIO FAR';
    const text = encodeURIComponent(`${title} — ${window.location.href} #Senegal #NioFar`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=600,height=400');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 2500);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadCircuit(slug);
      } else {
        this.isLoading.set(false);
      }
    });
  }

  async loadCircuit(slug: string): Promise<void> {
    this.isLoading.set(true);
    const circuit = await this.circuitService.getCircuitBySlug(slug);
    this.circuit.set(circuit);

    if (circuit) {
      this.seo.setPage({
        titleFr: circuit.title_fr,
        titleEn: circuit.title_en,
        descriptionFr: circuit.description_fr.slice(0, 160),
        descriptionEn: circuit.description_en.slice(0, 160),
        image: circuit.image_url,
        path: `/circuits/${slug}`
      });
      this.seo.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: this.lang.language() === 'fr' ? circuit.title_fr : circuit.title_en,
        description: this.lang.language() === 'fr' ? circuit.description_fr : circuit.description_en,
        image: circuit.image_url,
        offers: {
          '@type': 'Offer',
          price: circuit.price,
          priceCurrency: 'XOF',
          availability: 'https://schema.org/InStock'
        },
        provider: {
          '@type': 'TravelAgency',
          name: 'NIO FAR Tourisme',
          url: 'https://nio-far-tourisme.com'
        }
      }, `circuit-${slug}`);
    }

    if (circuit) {
      this.circuitService.getAttachments(circuit.id).then(atts => this.attachments.set(atts));
    }

    if (circuit && circuit.itinerary && circuit.itinerary.length > 0) {
      const excursions = await this.excursionService.loadExcursions();
      const excursionMap = new Map(excursions.map(e => [e.id, e]));

      const daysWithImages = circuit.itinerary.map(day => ({
        ...day,
        excursion_image: day.excursion_id && excursionMap.has(day.excursion_id)
          ? excursionMap.get(day.excursion_id)!.image_url
          : circuit.image_url
      }));

      this.itineraryDays.set(daysWithImages);
    }

    this.isLoading.set(false);
  }

  getTitle(): string {
    const c = this.circuit();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.title_fr : c.title_en;
  }

  getDuration(): string {
    const c = this.circuit();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.duration_fr : c.duration_en;
  }

  getDescription(): string {
    const c = this.circuit();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.description_fr : c.description_en;
  }

  getHighlights(): string[] {
    const c = this.circuit();
    if (!c) return [];
    return this.lang.language() === 'fr' ? c.highlights_fr : c.highlights_en;
  }

  getPriceNote(): string {
    const c = this.circuit();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.price_note_fr : c.price_note_en;
  }

  getIncludedServices(): string[] {
    const circuit = this.circuit();
    if (!circuit) return [];

    const services = this.lang.language() === 'fr'
      ? circuit.included_services_fr
      : circuit.included_services_en;

    return Array.isArray(services) ? services : [];
  }

  getDayTitle(day: ItineraryDay): string {
    return this.lang.language() === 'fr' ? day.title_fr : day.title_en;
  }

  getDayDescription(day: ItineraryDay): string {
    return this.lang.language() === 'fr' ? day.description_fr : day.description_en;
  }

  getDayLocation(day: ItineraryDay): string {
    return this.lang.language() === 'fr' ? (day.location_fr || '') : (day.location_en || '');
  }

  getDayAccommodation(day: ItineraryDay): string {
    return this.lang.language() === 'fr' ? (day.accommodation_fr || '') : (day.accommodation_en || '');
  }

  getDayMeals(day: ItineraryDay): string {
    return this.lang.language() === 'fr' ? (day.meals_fr || '') : (day.meals_en || '');
  }

  // ── Galerie d'images par étape ──────────────────────────────────────────────

  getStepImages(day: DayWithImage, fallback: string): string[] {
    const imgs = (day.images || []).filter(i => !!i);
    if (imgs.length > 0) return imgs;
    const single = day.excursion_image || fallback;
    return single ? [single] : [];
  }

  getActiveStepImage(day: DayWithImage, fallback: string): string {
    const imgs = this.getStepImages(day, fallback);
    const idx = this.dayActiveImageIndex().get(day.day) ?? 0;
    return imgs[idx] ?? fallback;
  }

  getActiveIndex(day: DayWithImage): number {
    return this.dayActiveImageIndex().get(day.day) ?? 0;
  }

  setActiveStepImage(day: DayWithImage, idx: number): void {
    const map = new Map(this.dayActiveImageIndex());
    map.set(day.day, idx);
    this.dayActiveImageIndex.set(map);
  }

  prevStepImage(day: DayWithImage, fallback: string): void {
    const imgs = this.getStepImages(day, fallback);
    const cur = this.getActiveIndex(day);
    this.setActiveStepImage(day, (cur - 1 + imgs.length) % imgs.length);
  }

  nextStepImage(day: DayWithImage, fallback: string): void {
    const imgs = this.getStepImages(day, fallback);
    const cur = this.getActiveIndex(day);
    this.setActiveStepImage(day, (cur + 1) % imgs.length);
  }

  // ── Lightbox ───────────────────────────────────────────────────────────────

  openLightbox(day: DayWithImage, fallback: string, startIndex: number): void {
    const images = this.getStepImages(day, fallback);
    if (!images.length) return;
    this.lightbox.set({
      images,
      index: startIndex,
      title: this.getDayTitle(day),
      totalImages: images.length
    });
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightbox.set(null);
    document.body.style.overflow = '';
  }

  lightboxPrev(): void {
    const lb = this.lightbox();
    if (!lb) return;
    this.lightbox.set({ ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length });
  }

  lightboxNext(): void {
    const lb = this.lightbox();
    if (!lb) return;
    this.lightbox.set({ ...lb, index: (lb.index + 1) % lb.images.length });
  }

  lightboxGoTo(idx: number): void {
    const lb = this.lightbox();
    if (!lb) return;
    this.lightbox.set({ ...lb, index: idx });
  }
}
