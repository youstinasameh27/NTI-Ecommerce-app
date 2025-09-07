import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';

type Cat = { _id: string; name: string; route?: string; parent?: string | null };

@Component({
  selector: 'app-category-cascade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-cascade.html',
  styleUrl: './category-cascade.css'
})
export class CategoryCascade implements OnInit {
  @Input() topId: string = '';     
  @Output() topIdChange = new EventEmitter<string>();
  @Input() value: string = '';   
  @Output() valueChange = new EventEmitter<string>();


  @Input() topLabel = 'Main (Men/Women)';
  @Input() childLabel = 'Category';
  @Input() topPlaceholder = 'Select main';
  @Input() childPlaceholder = 'Select category';
  @Input() disabled = false;

  all: Cat[] = [];
  tops: Cat[] = [];
  childs: Cat[] = [];
  busy = false;
  msg = '';

  constructor(private _catS: CategoryService) {}

  ngOnInit() {
    this.busy = true;
    this._catS.list().subscribe({
      next: (response: any) => {
        this.busy = false;
        const arr = response?.data || response || [];
        this.all = (arr || []).filter(Boolean);
        const men = this.all.find(c => (c.route || '').toLowerCase() === 'men' || (c.name || '').toLowerCase() === 'men');
        const women = this.all.find(c => (c.route || '').toLowerCase() === 'women' || (c.name || '').toLowerCase() === 'women');
        this.tops = [
          men || { _id: 'men', name: 'Men', route: 'men' },
          women || { _id: 'women', name: 'Women', route: 'women' }
        ];

        if (this.topId) this.onTopChange(false);
      },
      error: () => { this.busy = false; this.msg = 'Failed to load categories'; }
    });
  }

  private childrenFor(top: Cat | null): Cat[] {
    if (!top) return [];
    const slug = (top.route || top.name || '').toLowerCase();
    // Prefer parent link if you later add it; today we rely on route prefix
    const pref = slug === 'women' ? 'women-' : 'men-';
    return (this.all || []).filter(c => {
      const r = (c.route || '').toLowerCase();
      return !!r && r !== 'men' && r !== 'women' && r.startsWith(pref);
    });
  }

  onTopChange(emit: boolean = true) {
    const top = this.tops.find(t => t._id === this.topId) || null;
    this.childs = this.childrenFor(top);

    if (!this.childs.some(c => c._id === this.value)) {
      this.value = '';
      this.valueChange.emit(this.value);
    }
    if (emit) this.topIdChange.emit(this.topId);
  }

  onChildChange() {
    this.valueChange.emit(this.value);
  }
}
