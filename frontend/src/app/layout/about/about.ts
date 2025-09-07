import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutService } from '../../core/services/about.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnInit {
  title = 'About Us';
  content = '';
  loading = false;
  msg = '';

  constructor(private _aboutS: AboutService) {}

  ngOnInit(): void {
    this.loading = true;
    this._aboutS.get().subscribe({
      next: (r: any) => {
        const d = r?.data || r;
        this.title = d?.title || 'About Us';
        this.content = d?.content || '';
        this.loading = false;
      },
      error: () => { this.loading = false; this.msg = 'Failed to load'; }
    });
  }
}
