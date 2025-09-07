import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IContactPayload, IContactRes } from '../models/contact.model';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private _http: HttpClient) {}

  send(payload: IContactPayload) {
    return this._http.post<IContactRes>(`${environment.apiURL}/contact`, payload).pipe(
      map((res) => this.normalize(res)),
      catchError((err) =>
        this._http.post<IContactRes>(`${environment.apiURL}/contacts`, payload).pipe(
          map((res) => this.normalize(res)),
          catchError(() => of({ ok: false, message: this.errMsg(err) }))
        )
      )
    );
  }

  adminList() {
    return this._http.get<any>(`${environment.apiURL}/contact`).pipe(
      map((res) => (Array.isArray(res) ? res : res?.data) || [])
    );
  }

  markHandled(id: string) {
    return this._http.post(`${environment.apiURL}/contact/${id}/handled`, {});
  }

  list() {
    return this.adminList();
  }

  private normalize(res: IContactRes | any): { ok: boolean; message: string } {
    const ok = !!(res?.success ?? true);
    const msg = res?.message || (ok ? 'Sent successfully' : 'Failed to send');
    return { ok, message: msg };
  }

  private errMsg(err: any) {
    return err?.error?.message || err?.message || 'Failed to send';
  }
}