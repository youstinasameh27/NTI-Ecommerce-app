import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // adjust if your env path differs
import { PromoService } from '../../core/services/promo.service';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  code = '';
  percent = 10;
  msg = '';
  items: any[] = [];
  loading = false;
  cmsg = '';
  busy = false;

  constructor(
    private _promoS: PromoService,
    private _contactS: ContactService,
    private _http: HttpClient
  ) {}

  ngOnInit() { this.load(); }

  create() {
    this._promoS.create(this.code, this.percent).subscribe({
      next: () => this.msg = 'Promocode created',
      error: () => this.msg = 'Failed'
    });
  }

  load() {
    this.loading = true;
    const svc: any = this._contactS as any;
    const obs = typeof svc.list === 'function'
      ? svc.list()
      : this._http.get<any>(`${environment.apiURL}/contact`);

    obs.subscribe({
      next: (arr: any) => {
        this.items = Array.isArray(arr) ? arr : (arr?.data || []);
        this.loading = false;
      },
      error: () => {
        this.cmsg = 'Failed';
        this.loading = false;
      }
    });
  }

  handled(c: any) {
    this.busy = true;

    const svc: any = this._contactS as any;
    const obs = typeof svc.markHandled === 'function'
      ? svc.markHandled(c._id)
      : this._http.post<any>(`${environment.apiURL}/contact/${c._id}/handled`, {});

    obs.subscribe({
      next: () => { this.busy = false; this.load(); },
      error: () => { this.busy = false; this.cmsg = 'Failed'; }
    });
  }
}
