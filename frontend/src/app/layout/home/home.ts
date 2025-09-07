import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Categories } from './categories/categories';
import { ProductGrid } from './product-grid/product-grid';
import { Banner } from './banner/banner';
import { Newsletter } from './newsletter/newsletter';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Categories, ProductGrid, Banner, Newsletter],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
