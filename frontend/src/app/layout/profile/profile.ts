import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { OrderService } from '../../core/services/order.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  me?: User;
  editing = false;

  name = '';
  email = '';
  phone = '';
  address = '';
  msg = '';
  orders: any[] = [];
  loadingOrders = false;

  constructor(private _userS: UserService, private _orderS: OrderService) {}

  ngOnInit() {
    this.load();
    this.loadOrders();
  }

  load() {
    this._userS.me().subscribe({
      next: (r) => {
        const u = (r as any)?.data || (r as any);
        this.me = u;
        this.name = u?.name || '';
        this.email = u?.email || '';
        this.phone = u?.phone || '';
        this.address = u?.address || '';
      },
      error: () => { this.msg = 'Failed to load'; }
    });
  }

  edit() { this.editing = true; }
  cancel() { this.editing = false; this.load(); }

  save() {
    const body: Partial<User> = { name: this.name, email: this.email, phone: this.phone, address: this.address };
    this._userS.update(body).subscribe({
      next: (r) => {
        const u = (r as any)?.data || (r as any);
        this.me = u;
        this.msg = 'Saved';
        this.editing = false;
      },
      error: () => { this.msg = 'Failed'; }
    });
  }


  loadOrders() {
    this.loadingOrders = true;
    this._orderS.mine().subscribe({
      next: (arr) => { this.orders = arr || []; this.loadingOrders = false; },
      error: () => { this.loadingOrders = false; }
    });
  }


  itemsCount(o: any): number {
    return (o?.items || []).reduce((t: number, it: any) => t + (it?.qty || 0), 0);
  }
  orderTotal(o: any): number { return o?.totals?.grandTotal ?? o?.total ?? 0; }
  orderCurrency(o: any): string { return o?.totals?.currency ?? 'EGP'; }
  statusLabel(s: string): string {
    if (s === 'pending') return 'placed';
    if (s === 'received') return 'delivered';
    return s;
  }

  cancelReason(o: any): string | null {
    if (o?.status !== 'cancelled') return null;
    const direct = o?.cancellation?.reason;
    if (direct) return direct;
    const hist = (o?.statusHistory || []).filter((h: any) => h?.status === 'cancelled').pop();
    return hist?.note || 'Order was cancelled';
    }
}
