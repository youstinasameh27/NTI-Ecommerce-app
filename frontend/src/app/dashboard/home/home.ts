import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class DashboardHome implements OnInit {
  pendingCount = 0;
  unseenTestimonials = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts() {
    this.http.get<any>('/api/orders?status=pending').subscribe({
      next: (r) => this.pendingCount = (r.data || []).length,
      error: () => this.pendingCount = 0
    });
    this.http.get<any>('/api/testimonials?approved=false').subscribe({
      next: (r) => this.unseenTestimonials = (r.data || []).length,
      error: () => this.unseenTestimonials = 0
    });
  }
}
