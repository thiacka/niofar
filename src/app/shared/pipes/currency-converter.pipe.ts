import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyService } from '../../core/services/currency.service';

@Pipe({
  name: 'currencyConverter',
  standalone: true,
  pure: false
})
export class CurrencyConverterPipe implements PipeTransform {
  private currencyService = inject(CurrencyService);

  transform(amountInXOF: number | string | undefined | null): string {
    if (!amountInXOF || isNaN(Number(amountInXOF))) {
      return '0';
    }
    return this.currencyService.formatPrice(Number(amountInXOF));
  }
}
