import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { PricePipe } from '../../../core/pipes/price.pipe-pipe';
import { ImgUrlPipe } from '../../../core/pipes/img-url.pipe-pipe';

export interface Product {
  _id?: string;
  id?: string;
  productId?: string;
  title: string;
  price: number;
  imgURL?: string;
  route?: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe, ImgUrlPipe],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {
  @Input({required: true}) p!: Product;

  msg = '';
  busy = false;

  constructor(private _cart: CartService) {}

  addToCart(ev?: Event, p?: Product) {
    ev?.stopPropagation();
    this.add();
  }

  add() {
    const resolved = this.p._id || this.p.id || this.p.productId;
    if (!resolved) { this.msg = 'Missing product id'; return; }

    this.busy = true; this.msg = '';
    this._cart.increment(resolved, 1).subscribe((r: any) => {
      this.busy = false;
      this.msg = r.ok ? 'Added' : 'Failed';
      setTimeout(() => this.msg = '', 1500);
    });
  }
}
