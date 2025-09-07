import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../core/models/product.model';
import { PricePipe } from '../../../core/pipes/price.pipe-pipe';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ImgUrlPipe } from '../../../core/pipes/img-url.pipe-pipe';
@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, PricePipe, RouterLink,ImgUrlPipe],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.css'
})
export class ProductGrid implements OnInit {
  products: IProduct[] = [];
  uploads = environment.uploadsURL;
  constructor(private _productS: ProductService) {}
  ngOnInit() {
     this._productS.list().subscribe(r => this.products = r); 
    }
}
