import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ICategory, ICategoriesRes } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = environment.apiURL + '/category';
  constructor(private _http: HttpClient) { }

  getAll() {
    return this._http.get<ICategoriesRes>(this.url);
  }

  getByRoute(route: string) {
    return this._http.get<{ message: string, data: ICategory }>(`${this.url}/${route}`);
  }

  create(payload: { name: string, route: string }) {
    return this._http.post(this.url, payload);
  }

  list() {
    return this._http.get<ICategoriesRes>(this.url);
  }
}
