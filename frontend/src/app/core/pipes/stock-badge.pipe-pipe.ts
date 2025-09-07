import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stockBadge', standalone: true })
export class StockBadgePipe implements PipeTransform {
  transform(stock?: number): string {
    if (stock == null) return 'Unknown';
    if (stock <= 0) return 'Out of stock';
    if (stock < 5) return 'Few left';
    return 'In stock';
  }
}
