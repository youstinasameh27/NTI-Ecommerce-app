import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private _http: HttpClient) {}
  me() { 
    return this._http.get<{message:string,data:User}>(`${environment.apiURL}/users/me`);
   }
  update(data: Partial<User>) { 
    return this._http.post<{message:string,data:User}>(`${environment.apiURL}/users/me`, data);
   }
  all() { 
    return this._http.get<{message:string,data:User[]}>(`${environment.apiURL}/users`);
   }
}
