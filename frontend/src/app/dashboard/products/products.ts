import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  title = '';
  price = 0;
  stock = 0;
  route = '';
  categoryId = '';      // Men/Women
  subCategoryId = '';  
  desc = '';
  isActive = true;
  file: File | null = null;
  msg = '';
  busy = false;
  cats: any[] = [];

  constructor(private _ps: ProductService, private _catS: CategoryService) {}

  ngOnInit(): void {
    this._catS.list().subscribe({
      next: (arr: any) => this.cats = arr || [],
      error: () => {}
    });
  }

  onFile(e: any) { this.file = e?.target?.files?.[0] || null; }

  reset() {
    this.title=''; this.price=0; this.stock=0; this.route='';
    this.categoryId=''; this.subCategoryId=''; this.desc=''; this.isActive=true; this.file=null;
  }

  save() {
    this.msg = '';
    if (!this.title || !this.price || !this.route || !this.categoryId || !this.file) {
      this.msg = 'Please fill all required fields';
      return;
    }

    const body = {
      title: this.title,
      price: this.price,
      route: this.route,
      categoryId: this.categoryId,
      subCategoryId: this.subCategoryId || '',
      desc: this.desc,
      stock: this.stock,
      isActive: this.isActive
    };

    this.busy = true;
    this._ps.create(body, this.file!).subscribe({
      next: () => { this.busy = false; this.msg = 'Product created'; this.reset(); },
      error: (e) => { this.busy = false; this.msg = e?.error?.message || 'Failed to create product'; }
    });
  }
}
