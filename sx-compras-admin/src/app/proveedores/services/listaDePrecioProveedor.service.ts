import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';

import { ListaDePreciosProveedor } from '../models/listaDePreciosProveedor';

@Injectable()
export class ListaDePreciosProveedorService {
  private _apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {}

  list(): Observable<ListaDePreciosProveedor[]> {
    return this.http.get<ListaDePreciosProveedor[]>(this.apiUrl);
  }

  getPartidas(lp: ListaDePreciosProveedor): Observable<any[]> {
    const url = `${this.apiUrl}/${lp.id}/precios`;
    return this.http.get<any[]>(url);
  }

  get(id: string): Observable<ListaDePreciosProveedor> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ListaDePreciosProveedor>(url);
  }

  get apiUrl() {
    if (!this._apiUrl) {
      this._apiUrl = this.config.buildApiUrl('listaDePreciosProveedor');
    }
    return this._apiUrl;
  }

  save(lp: ListaDePreciosProveedor): Observable<ListaDePreciosProveedor> {
    return this.http
      .post<ListaDePreciosProveedor>(this.apiUrl, lp)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(lp: ListaDePreciosProveedor): Observable<ListaDePreciosProveedor> {
    const url = `${this.apiUrl}/${lp.id}`;
    return this.http
      .put<ListaDePreciosProveedor>(url, lp)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
