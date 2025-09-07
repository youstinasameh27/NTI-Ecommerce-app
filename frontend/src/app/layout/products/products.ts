import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { IProduct } from '../../core/models/product.model';
import { ICategory } from '../../core/models/category.model';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  categories: ICategory[] = [];
  selectedCategory: string = 'all';
  staticURL = environment.staticURL || '';

  constructor(private _productS: ProductService, private _categoryS: CategoryService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this._productS.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.applyFilter();
      },
      error: () => { this.products = []; this.applyFilter(); }
    });

    this._categoryS.getAll().subscribe({
      next: (res) => { this.categories = res.data || []; },
      error: () => { this.categories = []; }
    });
  }

  applyFilter() {
    if (this.selectedCategory === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => String(p.categoryId) === String(this.selectedCategory));
    }
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value || 'all';
    this.applyFilter();
  }
}
