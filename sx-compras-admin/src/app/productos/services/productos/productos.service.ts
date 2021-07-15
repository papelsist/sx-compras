import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { throwError, Observable } from 'rxjs';

import * as _ from 'lodash';

import { ConfigService } from 'app/utils/config.service';
import { Producto } from '../../models/producto';

@Injectable()
export class ProductosService {
  private _apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    // this.apiUrl = configService.buildApiUrl('productos');
  }

  list(filtro = {}): Observable<Producto[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    return this.http
      .get<Producto[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  get(id: string): Observable<Producto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Producto>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(producto: Producto): Observable<Producto> {
    return this.http
      .post<Producto>(this.apiUrl, producto)
      .pipe(catchError(error => throwError(error)));
  }

  update(prod: Producto): Observable<Producto> {
    const url = `${this.apiUrl}/${prod.id}`;
    console.log(url)
    console.log('Producto en el service');
    console.log(prod);
    return this.http
      .put<Producto>(url, prod)
      .pipe(catchError(error => throwError(error)));
  }


   updateProductoEcommerce(prod: Producto): Observable<Producto> {
    const url = `${this.apiUrl}/updateProductoEcommerce/${prod.id}`;
    console.log('Producto Ecommerce en el service ');
    console.log(prod);
    console.log(url);
    return this.http
      .put<Producto>(url, prod)
      .pipe(catchError(error => throwError(error)));
  }
 
  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(catchError(error => throwError(error)));
  }

  print(producto: Producto) {
    const url = `${this.apiUrl}/print/${producto.id}`;
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob'
    });
  }

  lookup(activos = true, linea = 'todas'): Observable<Producto[]> {
    const url = `${this.apiUrl}/rows/`;
    const params = new HttpParams()
      .set('activos', activos ? 'true' : 'false')
      .set('linea', linea);
    return this.http.get<Producto[]>(url, {
      params: params
    });
  }

  get apiUrl() {
    if (!this._apiUrl) {
      this._apiUrl = this.config.buildApiUrl('productos');
    }
    return this._apiUrl;
  }
}
