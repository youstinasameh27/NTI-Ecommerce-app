import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Report } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private _http: HttpClient) {}
  sales(q?: { from?: string; to?: string; }) {
    let params = new HttpParams();
    if (q?.from)
       params = params.set('from', q.from);
    if (q?.to)
       params = params.set('to', q.to);
    return this._http.get<Report>(`${environment.apiURL}/reports/sales`, { params });
  }
}
