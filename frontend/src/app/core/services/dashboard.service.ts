import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private _http: HttpClient) {}

  stats() { return this._http.get(`${environment.apiURL}/dashboard/overview`); }
}
