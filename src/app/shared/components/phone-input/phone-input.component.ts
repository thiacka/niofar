import { Component, Input, Output, EventEmitter, signal, computed, HostListener, ElementRef, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DialCountry {
  name: string;
  flag: string;
  dial: string;
  iso: string;
}

export const DIAL_COUNTRIES: DialCountry[] = [
  { name: 'Senegal', flag: 'SN', dial: '+221', iso: 'SN' },
  { name: 'France', flag: 'FR', dial: '+33', iso: 'FR' },
  { name: 'Belgium', flag: 'BE', dial: '+32', iso: 'BE' },
  { name: 'Switzerland', flag: 'CH', dial: '+41', iso: 'CH' },
  { name: 'Luxembourg', flag: 'LU', dial: '+352', iso: 'LU' },
  { name: 'Germany', flag: 'DE', dial: '+49', iso: 'DE' },
  { name: 'Italy', flag: 'IT', dial: '+39', iso: 'IT' },
  { name: 'Spain', flag: 'ES', dial: '+34', iso: 'ES' },
  { name: 'Portugal', flag: 'PT', dial: '+351', iso: 'PT' },
  { name: 'United Kingdom', flag: 'GB', dial: '+44', iso: 'GB' },
  { name: 'Ireland', flag: 'IE', dial: '+353', iso: 'IE' },
  { name: 'Netherlands', flag: 'NL', dial: '+31', iso: 'NL' },
  { name: 'Austria', flag: 'AT', dial: '+43', iso: 'AT' },
  { name: 'Denmark', flag: 'DK', dial: '+45', iso: 'DK' },
  { name: 'Sweden', flag: 'SE', dial: '+46', iso: 'SE' },
  { name: 'Norway', flag: 'NO', dial: '+47', iso: 'NO' },
  { name: 'Finland', flag: 'FI', dial: '+358', iso: 'FI' },
  { name: 'Poland', flag: 'PL', dial: '+48', iso: 'PL' },
  { name: 'Greece', flag: 'GR', dial: '+30', iso: 'GR' },
  { name: 'United States', flag: 'US', dial: '+1', iso: 'US' },
  { name: 'Canada', flag: 'CA', dial: '+1', iso: 'CA' },
  { name: 'Mexico', flag: 'MX', dial: '+52', iso: 'MX' },
  { name: 'Brazil', flag: 'BR', dial: '+55', iso: 'BR' },
  { name: 'Argentina', flag: 'AR', dial: '+54', iso: 'AR' },
  { name: 'Chile', flag: 'CL', dial: '+56', iso: 'CL' },
  { name: 'Colombia', flag: 'CO', dial: '+57', iso: 'CO' },
  { name: 'Peru', flag: 'PE', dial: '+51', iso: 'PE' },
  { name: 'Morocco', flag: 'MA', dial: '+212', iso: 'MA' },
  { name: 'Algeria', flag: 'DZ', dial: '+213', iso: 'DZ' },
  { name: 'Tunisia', flag: 'TN', dial: '+216', iso: 'TN' },
  { name: 'Egypt', flag: 'EG', dial: '+20', iso: 'EG' },
  { name: 'Mali', flag: 'ML', dial: '+223', iso: 'ML' },
  { name: 'Burkina Faso', flag: 'BF', dial: '+226', iso: 'BF' },
  { name: 'Ivory Coast', flag: 'CI', dial: '+225', iso: 'CI' },
  { name: 'Guinea', flag: 'GN', dial: '+224', iso: 'GN' },
  { name: 'Guinea-Bissau', flag: 'GW', dial: '+245', iso: 'GW' },
  { name: 'Mauritania', flag: 'MR', dial: '+222', iso: 'MR' },
  { name: 'Gambia', flag: 'GM', dial: '+220', iso: 'GM' },
  { name: 'Cape Verde', flag: 'CV', dial: '+238', iso: 'CV' },
  { name: 'Togo', flag: 'TG', dial: '+228', iso: 'TG' },
  { name: 'Benin', flag: 'BJ', dial: '+229', iso: 'BJ' },
  { name: 'Niger', flag: 'NE', dial: '+227', iso: 'NE' },
  { name: 'Nigeria', flag: 'NG', dial: '+234', iso: 'NG' },
  { name: 'Cameroon', flag: 'CM', dial: '+237', iso: 'CM' },
  { name: 'Gabon', flag: 'GA', dial: '+241', iso: 'GA' },
  { name: 'Congo', flag: 'CG', dial: '+242', iso: 'CG' },
  { name: 'DR Congo', flag: 'CD', dial: '+243', iso: 'CD' },
  { name: 'Kenya', flag: 'KE', dial: '+254', iso: 'KE' },
  { name: 'South Africa', flag: 'ZA', dial: '+27', iso: 'ZA' },
  { name: 'Ghana', flag: 'GH', dial: '+233', iso: 'GH' },
  { name: 'China', flag: 'CN', dial: '+86', iso: 'CN' },
  { name: 'Japan', flag: 'JP', dial: '+81', iso: 'JP' },
  { name: 'South Korea', flag: 'KR', dial: '+82', iso: 'KR' },
  { name: 'India', flag: 'IN', dial: '+91', iso: 'IN' },
  { name: 'Thailand', flag: 'TH', dial: '+66', iso: 'TH' },
  { name: 'Vietnam', flag: 'VN', dial: '+84', iso: 'VN' },
  { name: 'Indonesia', flag: 'ID', dial: '+62', iso: 'ID' },
  { name: 'Malaysia', flag: 'MY', dial: '+60', iso: 'MY' },
  { name: 'Singapore', flag: 'SG', dial: '+65', iso: 'SG' },
  { name: 'Philippines', flag: 'PH', dial: '+63', iso: 'PH' },
  { name: 'Saudi Arabia', flag: 'SA', dial: '+966', iso: 'SA' },
  { name: 'United Arab Emirates', flag: 'AE', dial: '+971', iso: 'AE' },
  { name: 'Qatar', flag: 'QA', dial: '+974', iso: 'QA' },
  { name: 'Kuwait', flag: 'KW', dial: '+965', iso: 'KW' },
  { name: 'Israel', flag: 'IL', dial: '+972', iso: 'IL' },
  { name: 'Turkey', flag: 'TR', dial: '+90', iso: 'TR' },
  { name: 'Australia', flag: 'AU', dial: '+61', iso: 'AU' },
  { name: 'New Zealand', flag: 'NZ', dial: '+64', iso: 'NZ' },
];

function isoToEmoji(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="phone-input-wrapper">
      <button
        type="button"
        class="dial-btn"
        (click)="toggleDropdown()"
        [disabled]="disabled"
        [attr.aria-expanded]="open()"
      >
        <span class="flag">{{ flagEmoji(selected()) }}</span>
        <span class="dial">{{ selected().dial }}</span>
        <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      <input
        type="tel"
        class="number-input"
        [name]="name"
        [placeholder]="placeholder"
        [(ngModel)]="localNumber"
        (ngModelChange)="emit()"
        [disabled]="disabled"
        autocomplete="tel-national"
      />

      @if (open()) {
        <div class="dropdown" (mousedown)="$event.preventDefault()">
          <div class="search-wrap">
            <input
              type="text"
              class="search"
              [(ngModel)]="searchTerm"
              name="dial_search"
              placeholder="Rechercher un pays..."
              autocomplete="off"
              autofocus
            />
          </div>
          <div class="options">
            @for (c of filtered(); track c.iso + c.dial) {
              <button type="button" class="option" (click)="select(c)">
                <span class="flag">{{ flagEmoji(c) }}</span>
                <span class="name">{{ c.name }}</span>
                <span class="dial muted">{{ c.dial }}</span>
              </button>
            }
            @if (filtered().length === 0) {
              <div class="no-result">Aucun résultat</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .phone-input-wrapper {
      position: relative;
      display: flex;
      align-items: stretch;
      width: 100%;
      border: 1px solid #d4d4d4;
      border-radius: 8px;
      background: #fff;
      overflow: visible;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .phone-input-wrapper:focus-within {
      border-color: var(--color-primary, #c4682b);
      box-shadow: 0 0 0 3px rgba(196, 104, 43, 0.1);
    }
    .dial-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0 10px;
      background: #f7f5f2;
      border: none;
      border-right: 1px solid #e5e5e5;
      border-radius: 8px 0 0 8px;
      cursor: pointer;
      font-size: 0.95rem;
      color: #3d2b1f;
      font-weight: 600;
      white-space: nowrap;
      transition: background 0.15s;
    }
    .dial-btn:hover:not(:disabled) { background: #efece7; }
    .dial-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .flag { font-size: 1.2rem; line-height: 1; }
    .chev { opacity: 0.55; }
    .number-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 10px 12px;
      font-size: 0.95rem;
      outline: none;
      min-width: 0;
      border-radius: 0 8px 8px 0;
      color: inherit;
      font-family: inherit;
    }
    .dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.12);
      z-index: 50;
      max-height: 300px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .search-wrap { padding: 8px; border-bottom: 1px solid #eee; }
    .search {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 0.9rem;
      outline: none;
    }
    .search:focus { border-color: var(--color-primary, #c4682b); }
    .options { overflow-y: auto; flex: 1; }
    .option {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      font-size: 0.9rem;
      color: #3d2b1f;
    }
    .option:hover { background: #f7f5f2; }
    .option .name { flex: 1; }
    .option .muted { color: #888; font-size: 0.85rem; }
    .no-result { padding: 16px; text-align: center; color: #888; font-size: 0.9rem; }
  `]
})
export class PhoneInputComponent implements OnInit, OnChanges {
  private host = inject(ElementRef<HTMLElement>);

  @Input() value: string | null = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() name = 'phone';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() defaultIso: string = 'FR';

  countries = DIAL_COUNTRIES;
  selected = signal<DialCountry>(DIAL_COUNTRIES.find(c => c.iso === 'FR') ?? DIAL_COUNTRIES[0]);
  localNumber = '';
  open = signal(false);
  searchTerm = '';

  filtered = computed(() => {
    const q = this.searchTerm.toLowerCase().trim();
    if (!q) return this.countries;
    return this.countries.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.iso.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.initFromValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].firstChange) {
      this.initFromValue();
    }
  }

  private initFromValue(): void {
    const v = (this.value ?? '').trim();
    if (!v) {
      const def = this.countries.find(c => c.iso === this.defaultIso) ?? this.countries[0];
      this.selected.set(def);
      this.localNumber = '';
      return;
    }

    const match = this.countries
      .filter(c => v.replace(/\s+/g, '').startsWith(c.dial))
      .sort((a, b) => b.dial.length - a.dial.length)[0];

    if (match) {
      this.selected.set(match);
      this.localNumber = v.replace(/\s+/g, '').slice(match.dial.length).trim();
    } else {
      this.localNumber = v;
    }
  }

  flagEmoji(c: DialCountry): string {
    return isoToEmoji(c.iso);
  }

  toggleDropdown(): void {
    this.open.update(o => !o);
    if (this.open()) this.searchTerm = '';
  }

  select(c: DialCountry): void {
    this.selected.set(c);
    this.open.set(false);
    this.emit();
  }

  emit(): void {
    const num = (this.localNumber ?? '').trim();
    const full = num ? `${this.selected().dial} ${num}` : '';
    this.valueChange.emit(full);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.host.nativeElement.contains(e.target as Node)) {
      this.open.set(false);
    }
  }
}
