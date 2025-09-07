import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FaqItem } from '../models/faq.model';

@Injectable({ providedIn: 'root' })
export class FaqService {
  constructor(private _http: HttpClient) {}

  list() { 
    return this._http.get<any>(`${environment.apiURL}/faq`);
   }
  create(item: FaqItem) {
     return this._http.post<any>(`${environment.apiURL}/faq`, item);
     }
  update(id: string, item: Partial<FaqItem>) 
  { return this._http.post<any>(`${environment.apiURL}/faq/${id}`, item); 
}
  remove(id: string) {
     return this._http.post<any>(`${environment.apiURL}/faq/${id}/delete`, {});
     }
}
