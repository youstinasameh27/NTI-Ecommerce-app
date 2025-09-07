import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { ImgUrlPipe } from '../../../core/pipes/img-url.pipe-pipe';
import { PricePipe } from '../../../core/pipes/price.pipe-pipe';

@Component({
  selector: 'app-related',
  standalone: true,
  imports: [CommonModule, RouterLink, ImgUrlPipe, PricePipe],
  templateUrl: './related.html',
  styleUrl: './related.css'
})
export class Related implements OnChanges {
  @Input() items: any[] = [];
  @Input() route?: string;

  loading = false;

  constructor(private _ps: ProductService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['route'] && this.route) this.fetch(this.route);
  }

  private fetch(route: string) {
    this.loading = true;
    this._ps.recommendations(route).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        this.items = list;
        this.loading = false;
      },
      error: () => { this.items = []; this.loading = false; }
    });
  }

  trackById = (_: number, x: any) => x?._id || x?.id || x?.route || _;
}
