import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuth$ = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isAuth$ = this._isAuth$.asObservable();

  constructor(private _http: HttpClient) {}

  private _readRole(t: string) {
    try {
      const p = JSON.parse(atob((t.split('.')[1] || '').replace(/-/g, '+').replace(/_/g, '/')));
      return (p?.role || p?.user?.role || p?.data?.role || '').toLowerCase();
    } catch { return ''; }
  }

  login(data: { email: string; password: string; }) {
    return this._http.post<{token:string; user?:{role?:string}}>(`${environment.apiURL}/auth/login`, data)
      .pipe(tap(res => {
        localStorage.setItem('token', res.token);
        const r = (res.user?.role || this._readRole(res.token) || 'user').toLowerCase();
        localStorage.setItem('role', r);
        this._isAuth$.next(true);
      }));
  }

  register(data: { name: string; email: string; password: string; }) {
    return this._http.post(`${environment.apiURL}/auth/register`, data);
  }

  logout() {
    localStorage.removeItem('token'); localStorage.removeItem('role'); this._isAuth$.next(false);
  }

  isUserLoggedin() {
     return !!localStorage.getItem('token');
     }
  isAdmin() 
  { 
    return (localStorage.getItem('role') || '').toLowerCase() === 'admin'; 
  }
}
