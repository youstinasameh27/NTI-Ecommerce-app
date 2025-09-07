import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.html',
  styleUrls: ['./toolbar.css']
})
export class ProductsToolbar {
  @Output() sortChange = new EventEmitter<string>();
  onSort(e: any) {
    this.sortChange.emit(e.target.value);
  }
}
