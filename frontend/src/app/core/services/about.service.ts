import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AboutInfo } from '../models/about.model';

@Injectable({ providedIn: 'root' })
export class AboutService {
  constructor(private _http: HttpClient) {}

  get() {
    return this._http.get<any>(`${environment.apiURL}/about`);
  }

  set(data: AboutInfo) {
    return this._http.post<any>(`${environment.apiURL}/about`, data);
  }
}
