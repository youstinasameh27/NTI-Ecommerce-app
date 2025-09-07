import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { ICategory } from '../../../core/models/category.model';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css'
})
export class Filters implements OnInit {
  items: ICategory[] = [];
  @Output() pick = new EventEmitter<string>();
  constructor(private _catS: CategoryService) {}
  ngOnInit(){ this._catS.list().subscribe(r => this.items = r || []); }
}
