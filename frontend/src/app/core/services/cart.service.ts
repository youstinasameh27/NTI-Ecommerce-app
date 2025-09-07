import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  [x: string]: any;
  private url = environment.apiURL + '/cart';
  private sessionKey = 'cartSessionId';
  constructor(private _http: HttpClient) { }

  private getSessionId(): string {
    let id = localStorage.getItem(this.sessionKey);
    if (!id) {
      id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(this.sessionKey, id);
    }
    return id;
  }

  getCart() {
    return this._http.get<{ message: string, data: any }>(this.url);
  }

  get() {
    return this._http.get<{ message: string, data: any }>(this.url);
  }

  addToCart(productId: string, qty: number = 1, variantId?: string) {
    const body: any = { productId, qty };
    if (variantId) body.variantId = variantId;
    return this._http.post<{ message: string, data: any }>(this.url, body).pipe(
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          const sessionId = this.getSessionId();
          const guestBody = { ...body, sessionId };
          return this._http.post<{ message: string, data: any }>(`${this.url}/guest/add`, guestBody);
        }
        return throwError(() => err);
      })
    );
  }

  add(body: any) {
    return this._http.post<{ message: string, data: any }>(this.url, body);
  }

  increment(productId: string, qty: number) {
    return this._http.post<{ message: string, data: any }>(`${this.url}/increment`, { productId, qty });
  }

  update(itemId: string, qty: number, productId: string) {
    return this._http.put<{ message: string, data: any }>(`${this.url}/${itemId}`, { qty, productId });
  }

  remove(itemId: string) {
    return this._http.delete<{ message: string }>(`${this.url}/${itemId}`);
  }

  clear() {
    return this._http.delete<{ message: string }>(this.url);
  }

  validate() {
    return this._http.post<{ message: string, data: any }>(`${this.url}/validate`, {}).pipe(
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          const sessionId = this.getSessionId();
          return this._http.post<{ message: string, data: any }>(`${this.url}/guest/validate`, { sessionId });
        }
        return throwError(() => err);
      })
    );
  }
}
