import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../../core/models/product.model';
import { environment } from '../../../../environments/environment';
import { ImgUrlPipe } from '../../../core/pipes/img-url.pipe-pipe';


@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, ImgUrlPipe],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery {
  
  @Input() p!: IProduct;
  uploads = environment.uploadsURL;
}
