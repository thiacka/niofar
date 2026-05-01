import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { COUNTRY_GROUPS, ALL_COUNTRIES, Country, CountryGroup } from './countries';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="phone-input-wrapper">
      @if (label) {
        <label class="phone-label">
          {{ label }}
          @if (required) {
            <span class="required">*</span>
          }
        </label>
      }

      <div class="phone-input-row" [class.disabled]="disabled">
        <!-- Country selector (for dial code only) -->
        <button
          type="button"
          class="country-selector"
          (click)="toggleDropdown()"
          [disabled]="disabled"
        >
          <span class="flag">{{ getFlag(dialCountry.code) }}</span>
          <span class="dial-code">{{ dialCountry.dialCode }}</span>
          <svg class="chevron" [class.open]="dropdownOpen" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <!-- Phone input -->
        <input
          type="tel"
          class="phone-input"
          [value]="nationalNumber"
          (input)="onPhoneInput($event)"
          [disabled]="disabled"
          [placeholder]="placeholder"
          [attr.aria-label]="label || 'Phone number'"
        />
      </div>

      <!-- Country dropdown -->
      @if (dropdownOpen) {
        <div class="country-dropdown">
          <div class="dropdown-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchInput()"
              (click)="$event.stopPropagation()"
              placeholder="Rechercher un pays..."
            />
          </div>
          <div class="dropdown-list">
            @for (group of filteredGroups; track group.region) {
              <div class="dropdown-group">
                <div class="dropdown-group-label">{{ group.region }}</div>
                @for (country of group.countries; track country.code) {
                  <div
                    class="dropdown-item"
                    [class.active]="country.code === dialCountry.code"
                    (click)="selectDialCountry(country)"
                  >
                    <span class="dropdown-flag">{{ getFlag(country.code) }}</span>
                    <span class="dropdown-name">{{ country.name }}</span>
                    <span class="dropdown-dial">{{ country.dialCode }}</span>
                  </div>
                }
              </div>
            }
            @if (filteredGroups.length === 0) {
              <div class="dropdown-empty">Aucun pays trouvé</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .phone-input-wrapper {
      position: relative;
    }

    .phone-label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: var(--color-text, #1a1a1a);
      font-size: 0.9rem;
    }

    .required {
      color: #dc2626;
      margin-left: 2px;
    }

    .phone-input-row {
      display: flex;
      align-items: stretch;
      gap: 0;
      border: 1px solid var(--color-border, #d4c5b5);
      border-radius: 6px;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: white;
    }

    .phone-input-row:focus-within {
      border-color: var(--color-primary, #c4682b);
      box-shadow: 0 0 0 3px rgba(196, 104, 43, 0.1);
    }

    .phone-input-row.disabled {
      opacity: 0.65;
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .country-selector {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 12px;
      background: #faf8f5;
      border: none;
      border-right: 1px solid var(--color-border, #d4c5b5);
      cursor: pointer;
      font-size: 0.95rem;
      white-space: nowrap;
      min-width: 110px;
      color: var(--color-text, #1a1a1a);
      transition: background 0.15s;
    }

    .country-selector:hover:not(:disabled) {
      background: #f0ece5;
    }

    .country-selector:disabled {
      cursor: not-allowed;
    }

    .flag {
      font-size: 1.15rem;
      line-height: 1;
    }

    .dial-code {
      font-weight: 500;
      font-size: 0.9rem;
      color: var(--color-text-light, #7a6355);
    }

    .chevron {
      margin-left: auto;
      color: var(--color-text-light, #7a6355);
      transition: transform 0.2s;
    }

    .chevron.open {
      transform: rotate(180deg);
    }

    .phone-input {
      flex: 1;
      border: none;
      padding: 10px 12px;
      font-size: 0.95rem;
      background: transparent;
      outline: none;
      color: var(--color-text, #1a1a1a);
      min-width: 0;
    }

    .phone-input:disabled {
      cursor: not-allowed;
    }

    .phone-input::placeholder {
      color: #b0a090;
    }

    .country-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      background: white;
      border: 1px solid var(--color-border, #d4c5b5);
      border-radius: 8px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
      z-index: 1000;
      max-height: 340px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .dropdown-search {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--color-border, #d4c5b5);
      color: var(--color-text-light, #7a6355);
    }

    .dropdown-search input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 0.9rem;
      color: var(--color-text, #1a1a1a);
      background: transparent;
    }

    .dropdown-search input::placeholder {
      color: #b0a090;
    }

    .dropdown-list {
      overflow-y: auto;
      flex: 1;
    }

    .dropdown-group-label {
      padding: 8px 12px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--color-text-light, #7a6355);
      background: #faf8f5;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      cursor: pointer;
      transition: background 0.12s;
      border-bottom: 1px solid #f5f0ea;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover,
    .dropdown-item.active {
      background: #fdf5ea;
    }

    .dropdown-flag {
      font-size: 1.15rem;
      width: 24px;
      text-align: center;
    }

    .dropdown-name {
      flex: 1;
      font-size: 0.9rem;
      color: var(--color-text, #1a1a1a);
    }

    .dropdown-dial {
      font-size: 0.85rem;
      color: var(--color-text-light, #7a6355);
      font-weight: 500;
      font-family: monospace;
    }

    .dropdown-empty {
      padding: 20px;
      text-align: center;
      color: var(--color-text-light, #7a6355);
      font-size: 0.9rem;
    }
  `]
})
export class PhoneInputComponent implements OnChanges {
  @Input() label = '';
  @Input() placeholder = 'XX XXX XX XX';
  @Input() disabled = false;
  @Input() required = false;

  /** Country used to initialise / update the dial code. Changes here do NOT emit countryChange. */
  @Input() country = '';

  private _dialCountry = 'Senegal';
  private _phone = '';

  @Input()
  set phone(value: string) {
    if (this._phone !== value) {
      this._phone = value;
      this.phoneChange.emit(value);
    }
  }
  get phone(): string {
    return this._phone;
  }
  @Output() phoneChange = new EventEmitter<string>();

  dropdownOpen = false;
  searchQuery = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['country'] && this.country) {
      const found = ALL_COUNTRIES.find(c => c.name === this.country);
      if (found) {
        this._dialCountry = found.name;
      }
    }
  }

  get dialCountry(): Country {
    return ALL_COUNTRIES.find(c => c.name === this._dialCountry) || ALL_COUNTRIES.find(c => c.name === 'Senegal')!;
  }

  get nationalNumber(): string {
    const dial = this.dialCountry.dialCode;
    if (!dial || !this._phone) return '';
    if (this._phone.startsWith(dial)) {
      return this._phone.slice(dial.length).trim();
    }
    // Strip any +prefix to get the national number
    const match = this._phone.match(/^\+[\d]+\s+(.*)$/);
    if (match) return match[1];
    return this._phone;
  }

  get filteredGroups(): CountryGroup[] {
    const term = this.searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (!term) return COUNTRY_GROUPS;

    const result: CountryGroup[] = [];
    for (const group of COUNTRY_GROUPS) {
      const countries = group.countries.filter(c => {
        const normalized = c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normalized.includes(term) || c.dialCode.includes(term);
      });
      if (countries.length) {
        result.push({ region: group.region, countries });
      }
    }
    return result;
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.searchQuery = '';
    }
  }

  selectDialCountry(c: Country): void {
    const national = this.nationalNumber;
    this._dialCountry = c.name;
    const newPhone = national ? `${c.dialCode} ${national}` : c.dialCode;
    this.phone = newPhone.trim();
    this.dropdownOpen = false;
  }

  onPhoneInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const dial = this.dialCountry.dialCode;
    const newPhone = value ? `${dial} ${value}` : dial;
    this.phone = newPhone.trim();
  }

  onSearchInput(): void {
    // searchQuery is already updated via ngModel
  }

  getFlag(code: string): string {
    const base = 0x1F1E6;
    const a = code.charCodeAt(0) - 65 + base;
    const b = code.charCodeAt(1) - 65 + base;
    return String.fromCodePoint(a, b);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.phone-input-wrapper')) {
      this.dropdownOpen = false;
    }
  }
}
