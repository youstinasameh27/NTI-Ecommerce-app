import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';

type Dict<T = any> = { [k: string]: T };

interface ProductOption {
  name: string;
  values: string[];
}

interface ProductVariant {
  _id?: string;
  key: string;   
  stock: number;
}

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actions.html',
  styleUrl: './actions.css'
})
export class Actions {
  @Input() p: any;         
  @Input() productId = ''; 

  qty = 1;
  sel: Dict<string> = {};            // Size: 'M', Color: 'Black' 
  msg = '';
  ok = '';
  busy = false;

  priceNow() {
    return this.p?.price || 0;
  }

  optionNames(): string[] {
    const opts: ProductOption[] = this.p?.options || [];
    return opts.map(o => o?.name).filter(Boolean);
  }

  valuesFor(name: string): string[] {
    const opt: ProductOption | undefined = (this.p?.options || []).find((o: ProductOption) => o.name === name);
    return opt?.values || [];
  }


  private buildKey(sel: Dict<string>): string {
    const names = this.optionNames().slice().sort();
    return names.map(n => `${n}:${sel[n] || ''}`).join('|');
  }

  private pickVariantByKey(key: string): ProductVariant | undefined {
    const vs: ProductVariant[] = this.p?.variants || [];
    return vs.find(v => (v?.key || '') === key);
  }

  selectedVariant(): ProductVariant | undefined {
    if (!this.allChosen()) return undefined;
    const key = this.buildKey(this.sel);
    return this.pickVariantByKey(key);
  }

  allChosen(): boolean {
    const names = this.optionNames();
    if (!names.length) return true; 
    return names.every(n => !!this.sel[n]);
  }

  stockLeft(): number {
    const names = this.optionNames();
    if (!names.length) return this.p?.stock || 0;
    const v = this.selectedVariant();
    return v?.stock || 0;
  }

  stockIfChoose(name: string, val: string): number {
    const names = this.optionNames();
    const vs: ProductVariant[] = this.p?.variants || [];

    if (!names.length) return this.p?.stock || 0;

    const sel: Dict<string> = { ...this.sel, [name]: val };

    const pairs = Object.keys(sel)
      .filter(k => !!sel[k])
      .map(k => `${k}:${sel[k]}`);

    let total = 0;
    for (const v of vs) {
      const key = v?.key || '';
      const match = pairs.every(pair => key.includes(pair));
      if (match) total += Math.max(0, v?.stock || 0);
    }
    return total;
  }

  isDisabled(name: string, val: string): boolean {
    return this.stockIfChoose(name, val) <= 0;
  }

  choose(name: string, val: string) {
    if (this.isDisabled(name, val)) return;
    this.sel[name] = val;
    this.msg = '';
    this.ok = '';
  }

  canAdd(): boolean {
    const hasOptions = (this.p?.options || []).length > 0;
    if (hasOptions && !this.allChosen()) return false;
    if ((this.qty || 0) < 1) return false;
    return this.stockLeft() >= this.qty;
  }

  inc() { if (this.qty < 99) this.qty++; }
  dec() { if (this.qty > 1) this.qty--; }

  add() {
    this.ok = '';
    this.msg = '';

    if (!this.canAdd()) {
      if (!this.allChosen()) this.msg = 'Please select all options';
      else if (this.stockLeft() < this.qty) this.msg = 'Not enough stock';
      else this.msg = 'Invalid quantity';
      return;
    }

    const pid = this.p?._id || this.productId;
    if (!pid) { this.msg = 'Product not found'; return; }

    const v = this.selectedVariant();
    const body: any = { productId: pid, qty: this.qty };
    if (v?._id) body.variantId = v._id;

    this.busy = true;
    this._cartS.add(body).subscribe({
      next: () => { this.busy = false; this.ok = 'Added to cart'; },
      error: (e) => { this.busy = false; this.msg = e?.error?.message || 'Failed to add'; }
    });
  }

  constructor(private _cartS: CartService) {}
}
