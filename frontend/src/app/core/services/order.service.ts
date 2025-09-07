import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
   private url = environment.apiURL + '/orders';
  constructor(private _http: HttpClient) {}

  create(payload: { shippingAddress: { address: string; phone: string; city?: string; governorate?: string; postalCode?: string; } }): Observable<any> {
    return this._http.post<any>(`${environment.apiURL}/orders`, payload);
  }

  mine(): Observable<Order[]> {
    return this._http.get<any>(`${environment.apiURL}/orders/mine`).pipe(
      map((res: any) => res?.data || [])
    );
  }

  list(): Observable<Order[]> {
    return this._http.get<any>(`${environment.apiURL}/orders`).pipe(
      map((res: any) => res?.data || [])
    );
  }
  getMyOrders() {
    return this._http.get<{ message: string, data: any[] }>(`${this.url}/mine`);
  }

  getOrder(id: string) {
    return this._http.get<{ message: string, data: any }>(`${this.url}/${id}`);
  }
  one(id: string): Observable<Order> {
    return this._http.get<any>(`${environment.apiURL}/orders/${id}`).pipe(
      map((res: any) => res?.data)
    );
  }

  setStatus(id: string, status: string, note?: string): Observable<any> {
    const body = { status, note };
    const primary$ = this._http.post<any>(`${environment.apiURL}/orders/${id}/status`, body);
    return primary$.pipe(
      catchError(() => this._http.post<any>(`${environment.apiURL}/orders/${id}`, body))
    );
  }
}
