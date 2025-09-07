import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PromoService {
  constructor(private _http: HttpClient) {}
  apply(code: string, total: number){ 
    return this._http.post<{discount:number; final:number}>(`${environment.apiURL}/promos/apply`, { code, total }); 
  }
  create(code: string, percent: number){ 
    return this._http.post(`${environment.apiURL}/promos`, { code, percent });
   }
}
