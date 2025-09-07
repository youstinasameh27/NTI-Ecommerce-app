import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {

  name: string = '';
  route: string = '';
  items: any[] = [];
  msg = '';
  ok = false;
  busy = false;

  constructor(private _catS: CategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  private load() {
    this._catS.list().subscribe({
      next: (arr: any) => { this.items = arr || []; },
      error: () => { this.items = []; }
    });
  }

  private slugify(s: string) {
    return (s || '').toString().trim().toLowerCase().replace(/\s+/g, '-');
  }

  save() {
    this.msg = ''; this.ok = false;

    const name = (this.name || '').trim();
    const route = (this.route || this.name || '').trim();

    if (!name || !route) {
      this.msg = 'Please fill Name and Route';
      return;
    }

    const slug = this.slugify(route);

    this.busy = true;
    this._catS.create({ name, route: slug }).subscribe({
      next: () => {
        this.ok = true; this.msg = 'Category created';
        this.name = ''; this.route = '';
        this.busy = false;
        this.load();
      },
      error: (e) => {
        this.busy = false;
        this.ok = false;
        this.msg = e?.error?.message || 'Failed to create category';
      }
    });
  }
}
