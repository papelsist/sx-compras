import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from 'app/utils/config.service';
import { GrupoDeProducto } from '../models/grupo';

@Injectable()
export class GruposService {
  private _apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    // this.apiUrl = configService.buildApiUrl('lineas');
  }

  list(filtro: any = {}): Observable<GrupoDeProducto[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    return this.http
      .get<GrupoDeProducto[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => observableThrowError(error)));
  }

  get(id: string): Observable<GrupoDeProducto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<GrupoDeProducto>(url);
  }

  save(linea: Partial<GrupoDeProducto>): Observable<GrupoDeProducto> {
    return this.http
      .post<GrupoDeProducto>(this.apiUrl, linea)
      .pipe(catchError(error => observableThrowError(error)));
  }

  update(linea: Partial<GrupoDeProducto>): Observable<GrupoDeProducto> {
    const url = `${this.apiUrl}/${linea.id}`;
    return this.http.put<GrupoDeProducto>(url, linea);
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError(error => observableThrowError(error)));
  }

  get apiUrl() {
    if (!this._apiUrl) {
      this._apiUrl = this.config.buildApiUrl('grupos');
    }
    return this._apiUrl;
  }
}
