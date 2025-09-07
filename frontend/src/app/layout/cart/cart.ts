import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { PromoService } from '../../core/services/promo.service';
import { AuthService } from '../../core/services/auth-service';
import { ImgUrlPipe } from '../../core/pipes/img-url.pipe-pipe';
import { PricePipe } from '../../core/pipes/price.pipe-pipe';
import { Cart as CartModel, CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ImgUrlPipe, PricePipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cart?: CartModel;
  address = '';
  phone = '';
  payment: 'COD' = 'COD';
  code = '';
  discount = 0;
  final = 0;
  msg = '';

  constructor(
    private _cartS: CartService,
    private _orderS: OrderService,
    private _promoS: PromoService,
    private _authS: AuthService,
    private _router: Router
  ) {}

  ngOnInit() {
    if (!this._authS.isUserLoggedin()) { this._router.navigate(['/auth/login']); return; }
    this.load();
  }

  load() {
    this._cartS.get().subscribe((r: any) => {
      this.cart = r.data as CartModel;
      this.compute();
    });
  }

  productTitle(i: CartItem): string {
    const p: any = i?.product;
    return typeof p === 'string' ? '' : (p?.title || '');
  }
  productImg(i: CartItem): string {
    const p: any = i?.product;
    return typeof p === 'string' ? '' : (p?.imgURL || '');
  }


  itemId(i: CartItem) { return (i as any)._id || (i as any).id; }

  inc(i: CartItem) {
    const p: any = i.product;
    const productId = typeof p === 'string' ? p : (p?._id || p?.id);
    const q = (i.qty || 1) + 1;
    this._cartS.update(i._id, q, productId).subscribe(() => this.load());
  }
  dec(i: CartItem) {
    const p: any = i.product;
    const productId = typeof p === 'string' ? p : (p?._id || p?.id);
    const q = Math.max(1, (i.qty || 1) - 1);
    this._cartS.update(i._id, q, productId).subscribe(() => this.load());
  }
  del(i: CartItem) {

    this._cartS.remove(this.itemId(i)).subscribe(() => this.load());
  }
  clear() {
    this._cartS.clear().subscribe(() => this.load());
  }


  subtotal() {
    return (this.cart?.items || []).reduce((s, x) => s + (x.qty || 1) * (x.price || 0), 0);
  }
  compute() {
    const t = this.subtotal();
    this.final = Math.max(0, t - this.discount);
  }

  apply() {
    const t = this.subtotal();
    this._promoS.apply(this.code, t).subscribe({
      next: (r: any) => { this.discount = r.discount; this.final = r.final; },
      error: () => { this.discount = 0; this.final = t; }
    });
  }

  checkout() {
    if (!this.address || !this.phone || !(this.cart?.items?.length)) { this.msg = 'Please fill address/phone and add items'; return; }
    const payload = { shippingAddress: { address: this.address, phone: this.phone, paymentMethod: this.payment } };
    this._orderS.create(payload).subscribe({ next: () => this.msg = 'Order placed', error: () => this.msg = 'Failed' });
  }

  trackByItemId(index: number, item: CartItem): string {
    return item._id;
  }
}
