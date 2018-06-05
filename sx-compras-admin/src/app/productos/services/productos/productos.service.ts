
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from 'app/utils/config.service';
import { Producto } from '../../models/producto';

@Injectable()
export class ProductosService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('productos');
  }

  list(filtro = {}): Observable<Producto[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    return this.http
      .get<Producto[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => observableThrowError(error.json())));
  }

  get(id: string): Observable<Producto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Producto>(url);
  }

  save(producto: Producto): Observable<Producto> {
    return this.http
      .post<Producto>(this.apiUrl, producto)
      .pipe(catchError(error => observableThrowError(error)));
  }

  update(prod: Producto): Observable<Producto> {
    const url = `${this.apiUrl}/${prod.id}`;
    return this.http
      .put<Producto>(url, prod)
      .pipe(catchError(error => observableThrowError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError(error => observableThrowError(error)));
  }

  print(producto: Producto) {
    const url = `${this.apiUrl}/print/${producto.id}`;
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob'
    });
  }
}
