import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { IProduct, IVariant } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CartService } from '../../core/services/cart.service';
import { TestimonialService } from '../../core/services/testimonial.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-product',
  imports: [CommonModule, RouterLink, DecimalPipe, DatePipe],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product implements OnInit {
  route!: string;
  product!: IProduct;
  relatedProducts: IProduct[] = [];
  staticURL = environment.staticURL || '';
  selectedOptions: { [name: string]: string | null } = {};
  availableValues: { [name: string]: Set<string> } = {};
  selectedVariant: IVariant | null = null;
  qty: number = 1;

  testimonials: any[] = [];
  canRate: boolean = false;
  myDeliveredOrders: any[] = [];

  constructor(
    private _productS: ProductService,
    private _activedRoute: ActivatedRoute,
    private _router: Router,
    private _cartS: CartService,
    private _testS: TestimonialService,
    private _orderS: OrderService
  ) { }

  ngOnInit(): void {
    this.route = this._activedRoute.snapshot.params['route'];
    if (!this.route) {
      this._router.navigate(['/products']);
      return;
    }
    this.loadProduct();
    this._orderS.getMyOrders().subscribe({
      next: (res) => {
        this.myDeliveredOrders = (res.data || []).filter((o: any) => ['delivered', 'received'].includes(o.status));
        this.updateCanRate();
      },
      error: () => { this.myDeliveredOrders = []; }
    });
  }

  loadProduct() {
    this._productS.getProductByRoute(this.route).subscribe({
      next: (res) => {
        this.product = res.data;
        (this.product.options || []).forEach(o => {
          this.selectedOptions[o.name] = null;
        });
        this.computeAvailableValues();
        this._testS.getPublic(this.product._id).subscribe({
          next: (r) => { this.testimonials = r.data || []; },
          error: () => { this.testimonials = []; }
        });

        // related
        this._productS.getRelatedProducts(this.route).subscribe({
          next: (r) => { this.relatedProducts = r.data || []; },
          error: () => { this.relatedProducts = []; }
        });
 
        this.updateCanRate();
      },
      error: (e) => { console.error(e); }
    });
  }

  computeAvailableValues() {
    this.availableValues = {};
    const variants = this.product.variants || [];

    for (const v of variants) {
      if ((v.stock || 0) <= 0) continue;
      const parts = (v.key || '').split('|').map(p => p.trim()).filter(Boolean);
      const map: { [k: string]: string } = {};
      for (const p of parts) {
        const [k, val] = p.split(':');
        if (k && val) map[k] = val;
      }
      for (const k of Object.keys(map)) {
        if (!this.availableValues[k]) this.availableValues[k] = new Set<string>();
        this.availableValues[k].add(map[k]);
      }
    }

  }

  isValueAvailable(optionName: string, val: string) {
    const s = this.availableValues[optionName];
    if (!s) return true; 
    return s.has(val);
  }

  selectOption(optionName: string, val: string) {

    if (this.selectedOptions[optionName] === val) {
      this.selectedOptions[optionName] = null;
    } else {
      this.selectedOptions[optionName] = val;
    }

    this.updateVariantAndAvailability();
  }

  updateVariantAndAvailability() {
    const variants = this.product.variants || [];
    const selectedPairs = Object.entries(this.selectedOptions).filter(([k, v]) => v);
    const matches = variants.filter(v => {
      const map: { [k: string]: string } = {};
      (v.key || '').split('|').map(p => p.trim()).filter(Boolean).forEach(p => {
        const [k, val] = p.split(':');
        if (k && val) map[k] = val;
      });
      for (const [k, val] of selectedPairs) {
        if (map[k] !== val) return false;
      }
      return true;
    }).filter(v => (v.stock || 0) > 0);

    const avail: { [name: string]: Set<string> } = {};
    for (const v of matches) {
      const parts = (v.key || '').split('|').map(p => p.trim()).filter(Boolean);
      const map: { [k: string]: string } = {};
      for (const p of parts) {
        const [k, val] = p.split(':');
        if (k && val) map[k] = val;
      }
      for (const k of Object.keys(map)) {
        if (!avail[k]) avail[k] = new Set<string>();
        avail[k].add(map[k]);
      }
    }
 
    if (Object.keys(avail).length === 0) {
      this.computeAvailableValues();
    } else {
      this.availableValues = avail;
    }

    const allSelected = Object.keys(this.selectedOptions).length > 0 && Object.values(this.selectedOptions).every(v => v);
    this.selectedVariant = null;
    if (allSelected) {
      const keyParts: string[] = [];
      for (const opt of (this.product.options || [])) {
        const name = opt.name;
        const val = this.selectedOptions[name];
        keyParts.push(`${name}:${val}`);
      }
      const key = keyParts.join('|');
      const found = (this.product.variants || []).find(v => (v.key || '').toLowerCase().trim() === key.toLowerCase().trim());
      if (found) this.selectedVariant = found;
    }
  }

  canAddToCart() {
    if (!this.product) return false;
    if ((this.product.options || []).length === 0) {
      return (this.product.stock || 0) > 0;
    }
    return !!(this.selectedVariant && (this.selectedVariant.stock || 0) > 0);
  }

  addToCart() {
    if (!this.canAddToCart()) {
      alert('Please select product options and ensure the product is in stock.');
      return;
    }
    const variantId = this.selectedVariant ? this.selectedVariant._id : undefined;
    this._cartS.addToCart(this.product._id || '', this.qty || 1, variantId).subscribe({
      next: (res) => {
        alert('Added to cart');
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Failed to add to cart');
      }
    });
  }

  updateCanRate() {
    if (!this.product || !this.myDeliveredOrders) { this.canRate = false; return; }
    const ordersWithProduct = (this.myDeliveredOrders || []).filter((o: any) => {
      return (o.items || []).some((it: any) => String(it.product) === String(this.product._id));
    });
    this.canRate = (ordersWithProduct.length > 0);
  }

  submitRating(orderId: string, ratingVal: string | number, content?: string) {
    if (!this.product) return;
    const rating = parseInt(String(ratingVal), 10) || 0;
    if (!orderId) {
      alert('Select the order that received this product');
      return;
    }
    if (rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }
    this._testS.addTestimonial({ productId: this.product._id || '', orderId, rating, content }).subscribe({
      next: (res) => {
        alert('Thank you for your rating. It will appear after approval.');
        this._testS.getPublic(this.product._id || '').subscribe(r => { this.testimonials = r.data || []; });
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Failed to submit rating');
      }
    });
  }
}
