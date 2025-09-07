import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../core/services/product.service';
import { CategoryCascade } from '../../shared/category-cascade/category-cascade';

interface ProductOption { name: string; values: string[]; }
interface ProductVariant { _id?: string; key: string; stock: number; }

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryCascade],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit implements OnInit {
  product: any = {
    _id: '',
    title: '',
    desc: '',
    price: 0,
    imgURL: '',
    route: '',
    categoryId: '',
    subCategoryId: '',
    stock: 0,
    options: [] as ProductOption[],
    variants: [] as ProductVariant[]
  };


  optName = '';
  optValues = ''; 
  msg = '';
  ok = '';
  busy = false;

  constructor(private _ps: ProductService, private _ar: ActivatedRoute) {}

  ngOnInit() {

    const id = this._ar.snapshot.paramMap.get('id') || this._ar.snapshot.queryParamMap.get('id') || '';
    const route = this._ar.snapshot.queryParamMap.get('route') || '';
    if (route) {
      this._ps.getByRoute(route).subscribe(r => this.fill(r?.data || r));
    } else if (id) {
      this.product._id = id;
    }
  }

  fill(p: any) {
    if (!p) return;
    this.product = {
      _id: p._id,
      title: p.title,
      desc: p.desc,
      price: p.price,
      imgURL: p.imgURL,
      route: p.route,
      categoryId: p.categoryId || '',
      subCategoryId: p.subCategoryId || '',
      stock: p.stock || 0,
      options: (p.options || []) as ProductOption[],
      variants: (p.variants || []) as ProductVariant[]
    };
  }

  addOption() {
    const name = (this.optName || '').trim();
    if (!name) { this.msg = 'Option name required'; return; }
    const values = (this.optValues || '')
      .split(',')
      .map(v => v.trim())
      .filter(v => !!v);
    if (!values.length) { this.msg = 'Enter at least one value'; return; }

    const exists = (this.product.options || []).some((o: ProductOption) => (o.name || '').toLowerCase() === name.toLowerCase());
    if (exists) { this.msg = 'Option already exists'; return; }

    this.product.options = [...(this.product.options || []), { name, values }];
    this.optName = '';
    this.optValues = '';
    this.msg = '';
  }

  removeOption(i: number) {
    this.product.options = (this.product.options || []).filter((_: any, idx: number) => idx !== i);
  }

  removeValue(i: number, j: number) {
    const opts = [...(this.product.options || [])];
    const values = [...(opts[i]?.values || [])].filter((_: any, idx: number) => idx !== j);
    opts[i] = { ...opts[i], values };
    this.product.options = opts;
  }

  private combos(opts: ProductOption[]): string[] {
    const sorted = [...opts].sort((a, b) => a.name.localeCompare(b.name));
    const build = (index: number, acc: string[]): string[] => {
      if (index >= sorted.length) return acc;
      const o = sorted[index];
      const next: string[] = [];
      for (const part of (acc.length ? acc : [''])) {
        for (const v of (o.values || [])) {
          const seg = `${o.name}:${v}`;
          next.push(part ? `${part}|${seg}` : seg);
        }
      }
      return build(index + 1, next);
    };
    return build(0, []);
  }

  generateVariants() {
    const opts: ProductOption[] = this.product.options || [];
    if (!opts.length) { this.msg = 'Add an option first'; return; }
    const keys = this.combos(opts);

    const old: ProductVariant[] = this.product.variants || [];
    const byKey: any = {};
    for (const v of old) byKey[v.key] = v;

    const fresh: ProductVariant[] = keys.map(k => {
      const prev = byKey[k];
      return prev ? { ...prev } : { key: k, stock: 0 };
    });

    this.product.variants = fresh;
    this.ok = 'Combinations generated';
    this.msg = '';
  }

  saveOptions() {
    if (!this.product?._id) { this.msg = 'Product id is missing'; return; }
    const payload = (this.product.options || []).map((o: ProductOption) => ({ name: o.name, values: o.values }));
    this.busy = true;
    this._ps.setOptions(this.product._id, payload).subscribe({
      next: (r: any) => { this.busy = false; this.ok = 'Options saved'; this.msg = ''; this.fill(r?.data || r); },
      error: (e) => { this.busy = false; this.msg = e?.error?.message || 'Failed to save options'; }
    });
  }

  saveVariants() {
    if (!this.product?._id) { this.msg = 'Product id is missing'; return; }
    const payload = (this.product.variants || []).map((v: ProductVariant) => ({ key: v.key, stock: Number(v.stock) || 0 }));
    this.busy = true;
    this._ps.setVariants(this.product._id, payload).subscribe({
      next: (r: any) => { this.busy = false; this.ok = 'Stock saved'; this.msg = ''; this.fill(r?.data || r); },
      error: (e) => { this.busy = false; this.msg = e?.error?.message || 'Failed to save stock'; }
    });
  }
}
