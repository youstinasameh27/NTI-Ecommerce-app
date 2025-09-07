import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'price', standalone: true })
export class PricePipe implements PipeTransform {
  transform(v: number, c: string = 'EGP'): string {
    if (v == null) return '';
    return new Intl.NumberFormat('en-EG', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(v);
  }
}
