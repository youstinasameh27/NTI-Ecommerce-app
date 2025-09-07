import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private url = environment.apiURL + '/testimonial';
  constructor(private _http: HttpClient) { }

  addTestimonial(payload: { productId: string, orderId: string, rating: number, content?: string }) {
    return this._http.post<{ message: string, data: any }>(this.url, payload);
  }

  getPublic(productId?: string) {
    const q = productId ? `?productId=${productId}` : '';
    return this._http.get<{ message: string, data: any[] }>(`${this.url}/public${q}`);
  }

  getPending() {
    return this._http.get<{ message: string, data: any[] }>(`${this.url}/pending`);
  }

  approve(id: string) {
    return this._http.post(`${this.url}/${id}/approve`, {});
  }

  pending() {
    return this._http.get<{ message: string, data: any[] }>(`${this.url}/pending`);
  }

  remove(id: string) {
    return this._http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}
