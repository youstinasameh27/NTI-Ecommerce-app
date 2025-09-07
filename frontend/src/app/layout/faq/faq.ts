import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqService } from '../../core/services/faq.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class Faq implements OnInit {
  items: any[] = [];
  loading = false;
  msg = '';

  constructor(private _faqS: FaqService) {}

  ngOnInit(): void {
    this.loading = true;
    this._faqS.list().subscribe({
      next: (r: any) => {
        const arr = r?.data || r || [];
        this.items = (arr || []).filter((x: any) => x?.enabled !== false);
        this.loading = false;
      },
      error: () => { this.loading = false; this.msg = 'Failed to load'; }
    });
  }
}
