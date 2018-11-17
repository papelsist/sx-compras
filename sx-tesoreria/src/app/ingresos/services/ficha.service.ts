import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from '../../utils/config.service';
import { Ficha, FichaFilter, FichaBuildCommand } from '../models/ficha';

@Injectable()
export class FichasService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('tesoreria/fichas');
  }

  list2(filtro: {} = {}): Observable<Ficha[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    return this.http
      .get<Ficha[]>(this.apiUrl, { params: params })
      .pipe(catchError(err => throwError(err)));
  }

  list(filter: FichaFilter): Observable<Ficha[]> {
    let params = new HttpParams()
      .set('tipo', filter.tipo)
      .set('fecha', filter.fecha.toISOString());
    if (filter.sucursal) {
      params = params.set('sucursal', filter.sucursal.id);
    }

    return this.http
      .get<Ficha[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Ficha> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Ficha>(url).pipe(catchError(err => throwError(err)));
  }

  generar(command: FichaBuildCommand): Observable<Ficha[]> {
    const url = `${this.apiUrl}/generar`;
    return this.http
      .post<Ficha[]>(url, command)
      .pipe(catchError(err => throwError(err)));
  }

  save(ficha: Ficha): Observable<Ficha> {
    return this.http
      .post<Ficha>(this.apiUrl, ficha)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(ficha: Ficha) {
    const url = `${this.apiUrl}/${ficha.id}`;
    return this.http
      .delete<Ficha>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  cheques(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/cheques`;
    return this.http.get<any>(url);
  }

  registrarIngreso(id: string): Observable<Ficha> {
    const url = `${this.apiUrl}/${id}/registrarIngreso`;
    return this.http
      .put<Ficha>(url, {})
      .pipe(catchError(err => throwError(err)));
  }
}
