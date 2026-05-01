import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { BookingService } from '../../core/services/booking.service';
import { ExcursionService, Excursion } from '../../core/services/excursion.service';
import { CircuitService } from '../../core/services/circuit.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { CurrencyConverterPipe } from '../../shared/pipes/currency-converter.pipe';
import { PhoneInputComponent } from '../../shared/components/phone-input/phone-input.component';
import { CountrySelectComponent } from '../../shared/components/phone-input/country-select.component';

@Component({
  selector: 'app-excursion-booking',
  imports: [FormsModule, RouterLink, ScrollAnimateDirective, CurrencyConverterPipe, PhoneInputComponent, CountrySelectComponent],
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

  // Country and phone are handled by app-phone-input component
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

    if (result.success && result.data?.reference_number) {
      const promo = this.appliedPromotion();
      if (promo?.id) {
        await this.excursionService.incrementPromotionUsage(promo.id);
      }
      await this.router.navigate(['/payment', result.data.reference_number]);
    } else {
      console.error('Booking failed or missing reference:', result);
      this.errorMessage.set(true);
    }
  }
}