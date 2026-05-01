import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { COUNTRY_GROUPS, ALL_COUNTRIES, Country, CountryGroup } from './countries';

@Component({
  selector: 'app-country-select',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="country-select-wrapper">
      @if (label) {
        <label class="country-select-label">
          {{ label }}
          @if (required) {
            <span class="required">*</span>
          }
        </label>
      }

      <div class="country-select-field" [class.open]="dropdownOpen" [class.disabled]="disabled" (click)="toggleDropdown()">
        @if (selectedCountry) {
          <span class="flag">{{ getFlag(selectedCountry.code) }}</span>
          <span class="name">{{ selectedCountry.name }}</span>
        } @else {
          <span class="placeholder">{{ placeholder }}</span>
        }
        <svg class="chevron" [class.open]="dropdownOpen" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

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
                    [class.active]="country.name === value"
                    (click)="selectCountry(country.name); $event.stopPropagation()"
                  >
                    <span class="dropdown-flag">{{ getFlag(country.code) }}</span>
                    <span class="dropdown-name">{{ country.name }}</span>
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
    .country-select-wrapper {
      position: relative;
    }

    .country-select-label {
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

    .country-select-field {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border: 1px solid var(--color-border, #d4c5b5);
      border-radius: 6px;
      background: white;
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s;
      min-height: 42px;
    }

    .country-select-field:hover:not(.disabled) {
      border-color: var(--color-primary, #c4682b);
    }

    .country-select-field.open {
      border-color: var(--color-primary, #c4682b);
      box-shadow: 0 0 0 3px rgba(196, 104, 43, 0.1);
    }

    .country-select-field.disabled {
      opacity: 0.65;
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .flag {
      font-size: 1.15rem;
      line-height: 1;
    }

    .name {
      flex: 1;
      font-size: 0.95rem;
      color: var(--color-text, #1a1a1a);
    }

    .placeholder {
      flex: 1;
      font-size: 0.95rem;
      color: #b0a090;
    }

    .chevron {
      color: var(--color-text-light, #7a6355);
      transition: transform 0.2s;
    }

    .chevron.open {
      transform: rotate(180deg);
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

    .dropdown-empty {
      padding: 20px;
      text-align: center;
      color: var(--color-text-light, #7a6355);
      font-size: 0.9rem;
    }
  `]
})
export class CountrySelectComponent {
  @Input() label = '';
  @Input() placeholder = 'Sélectionner un pays';
  @Input() disabled = false;
  @Input() required = false;

  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  dropdownOpen = false;
  searchQuery = '';

  get selectedCountry(): Country | undefined {
    return ALL_COUNTRIES.find(c => c.name === this.value);
  }

  get filteredGroups(): CountryGroup[] {
    const term = this.searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (!term) return COUNTRY_GROUPS;

    const result: CountryGroup[] = [];
    for (const group of COUNTRY_GROUPS) {
      const countries = group.countries.filter(c => {
        const normalized = c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normalized.includes(term);
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

  selectCountry(name: string): void {
    this.value = name;
    this.valueChange.emit(name);
    this.dropdownOpen = false;
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
    if (!target.closest('.country-select-wrapper')) {
      this.dropdownOpen = false;
    }
  }
}
