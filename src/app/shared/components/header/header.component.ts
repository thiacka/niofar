import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { EditModeService } from '../../../core/services/edit-mode.service';
import { CurrencyService, type Currency } from '../../../core/services/currency.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header" [class.scrolled]="isScrolled()" [class.edit-mode]="editMode.isEditMode()">
      <div class="container">
        <a routerLink="/" class="logo">
          <span class="logo-text">NIO FAR</span>
          <span class="logo-tagline">Travel Services</span>
        </a>

        <nav class="nav" [class.active]="mobileMenuOpen()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">
            {{ lang.t('nav.home') }}
          </a>
          <a routerLink="/services" routerLinkActive="active" (click)="closeMobileMenu()">
            {{ lang.t('nav.services') }}
          </a>
          <a routerLink="/experiences" routerLinkActive="active" (click)="closeMobileMenu()">
            {{ lang.t('nav.experiences') }}
          </a>
          <a routerLink="/excursions" routerLinkActive="active" (click)="closeMobileMenu()">
            {{ lang.t('nav.excursions') }}
          </a>
          <a routerLink="/circuits" routerLinkActive="active" (click)="closeMobileMenu()">
            {{ lang.t('nav.circuits') }}
          </a>
          <a routerLink="/rentals" routerLinkActive="active" (click)="closeMobileMenu()">
            {{ lang.t('nav.rentals') }}
          </a>
          <a routerLink="/why-nio-far" routerLinkActive="active" (click)="closeMobileMenu()">
            {{ lang.t('nav.why') }}
          </a>
          <a routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">
            {{ lang.t('nav.contact') }}
          </a>
        </nav>

        <div class="header-actions">
          <button class="lang-switch" (click)="lang.toggleLanguage()">
            {{ lang.language() === 'en' ? 'FR' : 'EN' }}
          </button>

          <select class="currency-select" [value]="currencyService.getCurrency()()" (change)="onCurrencyChange($event)">
            <option value="XOF">CFA</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
          </select>

          <button class="mobile-menu-btn" (click)="toggleMobileMenu()" [class.active]="mobileMenuOpen()">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--header-height);
      background: transparent;
      z-index: 1000;
      transition: all var(--transition-base);
    }

    .header.edit-mode {
      top: 44px;
    }

    .header.scrolled {
      background: var(--color-white);
      box-shadow: var(--shadow-md);
    }

    .header .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    .logo {
      display: flex;
      flex-direction: column;
      text-decoration: none;
    }

    .logo-text {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1;
    }

    .logo-tagline {
      font-size: 0.65rem;
      color: var(--color-secondary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: var(--spacing-xl);
    }

    .nav a {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--color-text);
      text-decoration: none;
      position: relative;
      padding: var(--spacing-xs) 0;
      transition: color var(--transition-fast);
    }

    .header:not(.scrolled) .nav a {
      color: var(--color-white);
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }

    .nav a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--color-primary);
      transition: width var(--transition-base);
    }

    .nav a:hover::after,
    .nav a.active::after {
      width: 100%;
    }

    .nav a:hover,
    .nav a.active {
      color: var(--color-primary);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-left: var(--spacing-xl);
    }

    .lang-switch {
      padding: var(--spacing-xs) var(--spacing-md);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-primary);
      background: var(--color-white);
      border: 2px solid var(--color-primary);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .header:not(.scrolled) .lang-switch {
      background: rgba(255,255,255,0.9);
    }

    .lang-switch:hover {
      background: var(--color-primary);
      color: var(--color-white);
    }

    .currency-select {
      padding: var(--spacing-xs) var(--spacing-md);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-primary);
      background: var(--color-white);
      border: 2px solid var(--color-primary);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-fast);
      outline: none;
    }

    .header:not(.scrolled) .currency-select {
      background: rgba(255,255,255,0.9);
    }

    .currency-select:hover,
    .currency-select:focus {
      background: var(--color-primary);
      color: var(--color-white);
    }

    .currency-select option {
      background: var(--color-white);
      color: var(--color-text);
    }

    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 30px;
      height: 30px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .mobile-menu-btn span {
      display: block;
      width: 100%;
      height: 2px;
      background: var(--color-text);
      transition: all var(--transition-fast);
    }

    .header:not(.scrolled) .mobile-menu-btn span {
      background: var(--color-white);
    }

    .mobile-menu-btn.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-btn.active span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-btn.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    @media (max-width: 992px) {
      .nav {
        position: fixed;
        top: var(--header-height);
        left: 0;
        right: 0;
        flex-direction: column;
        background: var(--color-white);
        padding: var(--spacing-xl);
        gap: var(--spacing-lg);
        box-shadow: var(--shadow-lg);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-base);
      }

      .nav.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .nav a {
        color: var(--color-text) !important;
        text-shadow: none !important;
        font-size: 1.1rem;
      }

      .mobile-menu-btn {
        display: flex;
      }
    }
  `]
})
export class HeaderComponent {
  lang = inject(LanguageService);
  editMode = inject(EditModeService);
  currencyService = inject(CurrencyService);
  mobileMenuOpen = signal(false);
  isScrolled = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 50);
      });
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onCurrencyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.currencyService.setCurrency(select.value as Currency);
  }
}
