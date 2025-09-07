import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, of } from 'rxjs';
import { IProductRes, IProductsRes } from '../models/product.model';
type SortBy = 'price' | 'name';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private _http: HttpClient) {}

  list(params?: {
    search?: string;
    categoryId?: string;
    subCategoryId?: string;
    sortby?: SortBy;
    order?: 'asc'|'desc';
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    let hp = new HttpParams();
    if (!params) params = {};
    if (params.search) hp = hp.set('search', params.search);
    if (params.categoryId) hp = hp.set('categoryId', params.categoryId);
    if (params.subCategoryId) hp = hp.set('subCategoryId', params.subCategoryId);
    if (params.sort) hp = hp.set('sort', params.sort);
    if (params.sortby) hp = hp.set('sortby', params.sortby);
    if (params.order) hp = hp.set('order', params.order);
    if (params.page) hp = hp.set('page', String(params.page));
    if (params.limit) hp = hp.set('limit', String(params.limit));

    return this._http.get<any>(`${environment.apiURL}/products`, { params: hp }).pipe(
      map(r => r?.data ?? r),
      catchError(() => of([]))
    );
  }

  getByRoute(route: string) {
    return this._http.get<any>(`${environment.apiURL}/products/${route}`).pipe(
      map(r => r?.data ?? r)
    );
  }
 private url = environment.apiURL + '/product';

 getRelatedProducts(route:string){
  return this._http.get<IProductsRes>(`${this.url}/${route}/recommendations`);
 }
 getAllProducts(){
  return this._http.get<IProductsRes>(this.url);
 }

 getProductByRoute(route:string){
  return this._http.get<IProductRes>(this.url+ `/${route}`);
 }

  recommendations(route: string) {
    return this._http.get<any>(`${environment.apiURL}/products/${route}/recommendations`).pipe(
      map(r => r?.data ?? r),
      catchError(() => of([]))
    );
  }

  create(body: {
    title: string;
    price: number;
    route: string;
    categoryId: string;
    subCategoryId?: string;
    desc?: string;
    stock?: number;
    isActive?: boolean;
  }, img?: File) {
    const fd = new FormData();
    fd.append('title', body.title);
    fd.append('price', String(body.price));
    fd.append('route', body.route);
    fd.append('categoryId', body.categoryId);
    if (body.subCategoryId) fd.append('subCategoryId', body.subCategoryId);
    if (body.desc) fd.append('desc', body.desc);
    if (typeof body.stock === 'number') fd.append('stock', String(body.stock));
    if (typeof body.isActive === 'boolean') fd.append('isActive', body.isActive ? 'true' : 'false');
    if (img) fd.append('img', img);
    return this._http.post<any>(`${environment.apiURL}/products`, fd);
  }

  setOptions(productId: string, options: { name: string; values: string[] }[]) {
    return this._http.post<any>(`${environment.apiURL}/products/${productId}/options`, { options });
  }

  setVariants(productId: string, variants: { key: string; stock: number }[]) {
    return this._http.post<any>(`${environment.apiURL}/products/${productId}/variants`, { variants });
  }

}
