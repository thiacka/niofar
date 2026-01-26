import { Injectable, signal } from '@angular/core';

export type Currency = 'XOF' | 'EUR' | 'USD';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  rate: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly currencies: Record<Currency, CurrencyInfo> = {
    XOF: { code: 'XOF', symbol: 'F CFA', name: 'Franc CFA', rate: 1 },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 656 },
    USD: { code: 'USD', symbol: '$', name: 'Dollar', rate: 600 }
  };

  private currentCurrency = signal<Currency>('XOF');

  constructor() {
    const saved = localStorage.getItem('currency') as Currency;
    if (saved && this.currencies[saved]) {
      this.currentCurrency.set(saved);
    }
  }

  getCurrency() {
    return this.currentCurrency.asReadonly();
  }

  setCurrency(currency: Currency) {
    this.currentCurrency.set(currency);
    localStorage.setItem('currency', currency);
  }

  getCurrencyInfo(currency?: Currency): CurrencyInfo {
    return this.currencies[currency || this.currentCurrency()];
  }

  getAllCurrencies(): CurrencyInfo[] {
    return Object.values(this.currencies);
  }

  convert(amountInXOF: number, toCurrency?: Currency): number {
    const currency = toCurrency || this.currentCurrency();
    const rate = this.currencies[currency].rate;
    return Math.round(amountInXOF / rate);
  }

  formatPrice(amountInXOF: number, toCurrency?: Currency): string {
    const currency = toCurrency || this.currentCurrency();
    const converted = this.convert(amountInXOF, currency);
    const info = this.currencies[currency];

    if (currency === 'XOF') {
      return `${converted.toLocaleString('fr-FR')} ${info.symbol}`;
    } else if (currency === 'EUR') {
      return `${converted.toLocaleString('fr-FR')} ${info.symbol}`;
    } else {
      return `${info.symbol}${converted.toLocaleString('en-US')}`;
    }
  }
}
