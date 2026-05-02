import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { BookingService } from '../../core/services/booking.service';
import { ExcursionService, Excursion } from '../../core/services/excursion.service';
import { CircuitService } from '../../core/services/circuit.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { CurrencyConverterPipe } from '../../shared/pipes/currency-converter.pipe';

@Component({
  selector: 'app-excursion-booking',
  imports: [FormsModule, RouterLink, ScrollAnimateDirective, CurrencyConverterPipe],
  templateUrl: './excursion-booking.component.html',
  styleUrl: './excursion-booking.component.css',
})
export class ExcursionBookingComponent implements OnInit {
  lang = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private excursionService = inject(ExcursionService);

  
  excursion = signal<Excursion | null>(null);
  isLoadingExcursion = signal(true);
  isSubmitting = signal(false);
  successMessage = signal(false);
  errorMessage = signal(false);
  dateError = signal(false);

  minDate = new Date().toISOString().split('T')[0];

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    specialRequests: '',
    promotionCode: ''
  };

  appliedPromotion = signal<any | null>(null);
  isCheckingPromo = signal(false);
  promoError = signal(false);
  promoSuccess = signal(false);

  countryGroups = [
    {
      name: 'Afrique / Africa',
      countries: [
        { name: 'Senegal', flag: '🇸🇳' },
        { name: 'Algeria', flag: '🇩🇿' },
        { name: 'Angola', flag: '🇦🇴' },
        { name: 'Benin', flag: '🇧🇯' },
        { name: 'Botswana', flag: '🇧🇼' },
        { name: 'Burkina Faso', flag: '🇧🇫' },
        { name: 'Burundi', flag: '🇧🇮' },
        { name: 'Cameroon', flag: '🇨🇲' },
        { name: 'Cape Verde', flag: '🇨🇻' },
        { name: 'Central African Republic', flag: '🇨🇫' },
        { name: 'Chad', flag: '🇹🇩' },
        { name: 'Comoros', flag: '🇰🇲' },
        { name: 'Congo', flag: '🇨🇬' },
        { name: 'Ivory Coast', flag: '🇨🇮' },
        { name: 'Democratic Republic of Congo', flag: '🇨🇩' },
        { name: 'Djibouti', flag: '🇩🇯' },
        { name: 'Egypt', flag: '🇪🇬' },
        { name: 'Equatorial Guinea', flag: '🇬🇶' },
        { name: 'Eritrea', flag: '🇪🇷' },
        { name: 'Eswatini', flag: '🇸🇿' },
        { name: 'Ethiopia', flag: '🇪🇹' },
        { name: 'Gabon', flag: '🇬🇦' },
        { name: 'Gambia', flag: '🇬🇲' },
        { name: 'Ghana', flag: '🇬🇭' },
        { name: 'Guinea', flag: '🇬🇳' },
        { name: 'Guinea-Bissau', flag: '🇬🇼' },
        { name: 'Kenya', flag: '🇰🇪' },
        { name: 'Lesotho', flag: '🇱🇸' },
        { name: 'Liberia', flag: '🇱🇷' },
        { name: 'Libya', flag: '🇱🇾' },
        { name: 'Madagascar', flag: '🇲🇬' },
        { name: 'Malawi', flag: '🇲🇼' },
        { name: 'Mali', flag: '🇲🇱' },
        { name: 'Mauritania', flag: '🇲🇷' },
        { name: 'Mauritius', flag: '🇲🇺' },
        { name: 'Morocco', flag: '🇲🇦' },
        { name: 'Mozambique', flag: '🇲🇿' },
        { name: 'Namibia', flag: '🇳🇦' },
        { name: 'Niger', flag: '🇳🇪' },
        { name: 'Nigeria', flag: '🇳🇬' },
        { name: 'Rwanda', flag: '🇷🇼' },
        { name: 'Sao Tome and Principe', flag: '🇸🇹' },
        { name: 'Seychelles', flag: '🇸🇨' },
        { name: 'Sierra Leone', flag: '🇸🇱' },
        { name: 'Somalia', flag: '🇸🇴' },
        { name: 'South Africa', flag: '🇿🇦' },
        { name: 'South Sudan', flag: '🇸🇸' },
        { name: 'Sudan', flag: '🇸🇩' },
        { name: 'Tanzania', flag: '🇹🇿' },
        { name: 'Togo', flag: '🇹🇬' },
        { name: 'Tunisia', flag: '🇹🇳' },
        { name: 'Uganda', flag: '🇺🇬' },
        { name: 'Zambia', flag: '🇿🇲' },
        { name: 'Zimbabwe', flag: '🇿🇼' }
      ]
    },
    {
      name: 'Europe',
      countries: [
        { name: 'Austria', flag: '🇦🇹' },
        { name: 'Belgium', flag: '🇧🇪' },
        { name: 'Denmark', flag: '🇩🇰' },
        { name: 'Finland', flag: '🇫🇮' },
        { name: 'France', flag: '🇫🇷' },
        { name: 'Germany', flag: '🇩🇪' },
        { name: 'Greece', flag: '🇬🇷' },
        { name: 'Ireland', flag: '🇮🇪' },
        { name: 'Italy', flag: '🇮🇹' },
        { name: 'Luxembourg', flag: '🇱🇺' },
        { name: 'Netherlands', flag: '🇳🇱' },
        { name: 'Norway', flag: '🇳🇴' },
        { name: 'Poland', flag: '🇵🇱' },
        { name: 'Portugal', flag: '🇵🇹' },
        { name: 'Spain', flag: '🇪🇸' },
        { name: 'Sweden', flag: '🇸🇪' },
        { name: 'Switzerland', flag: '🇨🇭' },
        { name: 'United Kingdom', flag: '🇬🇧' }
      ]
    },
    {
      name: 'Amerique / Americas',
      countries: [
        { name: 'Argentina', flag: '🇦🇷' },
        { name: 'Brazil', flag: '🇧🇷' },
        { name: 'Canada', flag: '🇨🇦' },
        { name: 'Chile', flag: '🇨🇱' },
        { name: 'Colombia', flag: '🇨🇴' },
        { name: 'Mexico', flag: '🇲🇽' },
        { name: 'Peru', flag: '🇵🇪' },
        { name: 'United States', flag: '🇺🇸' }
      ]
    },
    {
      name: 'Asie / Asia',
      countries: [
        { name: 'China', flag: '🇨🇳' },
        { name: 'India', flag: '🇮🇳' },
        { name: 'Indonesia', flag: '🇮🇩' },
        { name: 'Japan', flag: '🇯🇵' },
        { name: 'Malaysia', flag: '🇲🇾' },
        { name: 'Philippines', flag: '🇵🇭' },
        { name: 'Singapore', flag: '🇸🇬' },
        { name: 'South Korea', flag: '🇰🇷' },
        { name: 'Thailand', flag: '🇹🇭' },
        { name: 'Vietnam', flag: '🇻🇳' }
      ]
    },
    {
      name: 'Oceanie / Oceania',
      countries: [
        { name: 'Australia', flag: '🇦🇺' },
        { name: 'New Zealand', flag: '🇳🇿' }
      ]
    },
    {
      name: 'Moyen-Orient / Middle East',
      countries: [
        { name: 'Saudi Arabia', flag: '🇸🇦' },
        { name: 'United Arab Emirates', flag: '🇦🇪' },
        { name: 'Qatar', flag: '🇶🇦' },
        { name: 'Kuwait', flag: '🇰🇼' },
        { name: 'Israel', flag: '🇮🇱' },
        { name: 'Turkey', flag: '🇹🇷' }
      ]
    },
    {
      name: 'Autre / Other',
      countries: [
        { name: 'Other', flag: '🌍' }
      ]
    }
  ];

  showCountryDropdown = signal(false);

  filteredCountryGroups = computed(() => {
    const searchTerm = this.formData.country.toLowerCase().trim();

    if (!searchTerm) {
      return this.countryGroups;
    }

    return this.countryGroups
      .map(continent => ({
        ...continent,
        countries: continent.countries.filter(country =>
          country.name.toLowerCase().includes(searchTerm)
        )
      }))
      .filter(continent => continent.countries.length > 0);
  });

  selectCountry(countryName: string): void {
    this.formData.country = countryName;
    this.showCountryDropdown.set(false);
  }

  onCountryBlur(): void {
    setTimeout(() => {
      this.showCountryDropdown.set(false);
    }, 200);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const excursionSlug = params.get('excursionId');
      if (excursionSlug) {
        this.loadExcursion(excursionSlug);
      } else {
        this.isLoadingExcursion.set(false);
      }
    });
  }

  async loadExcursion(slug: string): Promise<void> {
    this.isLoadingExcursion.set(true);
    const found = await this.excursionService.getExcursionBySlug(slug);
    this.excursion.set(found);
    this.isLoadingExcursion.set(false);
  }

  getTitle(): string {
    const c = this.excursion();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.title_fr : c.title_en;
  }

  getDuration(): string {
    const c = this.excursion();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.duration_fr : c.duration_en;
  }

  getPriceNote(): string {
    const c = this.excursion();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.price_note_fr : c.price_note_en;
  }

  estimatedTotal(): number {
    const c = this.excursion();
    if (!c) return 0;
    const totalPersons = this.formData.adults + Math.ceil(this.formData.children * 0.5);
    let total = c.price * totalPersons;

    const promo = this.appliedPromotion();
    if (promo) {
      if (promo.discount_type === 'percentage') {
        total = total * (1 - promo.discount_value / 100);
      } else if (promo.discount_type === 'fixed') {
        total = Math.max(0, total - promo.discount_value);
      }
    }

    return total;
  }

  async checkPromotionCode(): Promise<void> {
    const code = this.formData.promotionCode.trim();

    if (!code) {
      this.appliedPromotion.set(null);
      this.promoError.set(false);
      this.promoSuccess.set(false);
      return;
    }

    this.isCheckingPromo.set(true);
    this.promoError.set(false);
    this.promoSuccess.set(false);

    const promotion = await this.excursionService.getPromotionByCode(code);

    this.isCheckingPromo.set(false);

    if (promotion) {
      const excursionId = this.excursion()?.id;
      if (promotion.circuit_id && promotion.circuit_id !== excursionId) {
        this.appliedPromotion.set(null);
        this.promoError.set(true);
        this.promoSuccess.set(false);
      } else {
        this.appliedPromotion.set(promotion);
        this.promoSuccess.set(true);
        this.promoError.set(false);
      }
    } else {
      this.appliedPromotion.set(null);
      this.promoError.set(true);
      this.promoSuccess.set(false);
    }
  }

  validateDates(): boolean {
    if (this.formData.endDate && this.formData.startDate) {
      return new Date(this.formData.endDate) >= new Date(this.formData.startDate);
    }
    return true;
  }

  async onSubmit(): Promise<void> {
    const c = this.excursion();
    if (!c) return;

    if (!this.validateDates()) {
      this.dateError.set(true);
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set(false);
    this.errorMessage.set(false);
    this.dateError.set(false);

    const result = await this.bookingService.createBooking({
      excursion_id: c.slug,
      excursion_title: this.getTitle(),
      first_name: this.formData.firstName,
      last_name: this.formData.lastName,
      email: this.formData.email,
      phone: this.formData.phone || null,
      country: this.formData.country,
      start_date: this.formData.startDate,
      end_date: this.formData.endDate || null,
      adults: this.formData.adults,
      children: this.formData.children,
      special_requests: this.formData.specialRequests || null,
      estimated_total: this.estimatedTotal()
    });

    this.isSubmitting.set(false);

    if (result.success && result.data) {
      const promo = this.appliedPromotion();
      if (promo?.id) {
        await this.excursionService.incrementPromotionUsage(promo.id);
      }
      this.router.navigate(['/payment', result.data.reference_number]);
    } else {
      this.errorMessage.set(true);
    }
  }
}