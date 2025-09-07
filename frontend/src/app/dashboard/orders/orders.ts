import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-dashboard-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  items: any[] = [];
  busy = false;
  msg = '';
  statuses: string[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  note: Record<string, string> = {};

  constructor(private _orderS: OrderService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.busy = true;
    this._orderS.list().subscribe({
      next: (arr) => { this.items = arr || []; this.busy = false; },
      error: () => { this.busy = false; this.msg = 'Failed to load orders'; }
    });
  }

  amount(o: any): number {
    return (o?.totals?.grandTotal ?? o?.total ?? 0);
  }

  save(o: any) {
    if (!o?._id || !o?.status) return;
    const note = this.note[o._id] || '';
    this._orderS.setStatus(o._id, o.status, note).subscribe({
      next: () => this.load(),
      error: () => this.msg = 'Failed to update status'
    });
  }

  totalItems(o: any) {
    return (o?.items || []).reduce((t: number, it: any) => t + (it?.qty || 0), 0);
  }
}
