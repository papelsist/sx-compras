import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from '../../utils/config.service';
import { Traspaso, TraspasosFilter } from '../models/traspaso';
import { Update } from '@ngrx/entity';

@Injectable()
export class TraspasoService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('tesoreria/traspasos');
  }

  list(filter: TraspasosFilter): Observable<Traspaso[]> {
    let params = new HttpParams()
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.registros) {
      params = params.set('max', filter.registros.toString());
    }
    if (filter.cuenta) {
      params = params.set('cuenta', filter.cuenta.id);
    }
    return this.http
      .get<Traspaso[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Traspaso> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Traspaso>(url)
      .pipe(catchError(err => throwError(err)));
  }

  save(ficha: Traspaso): Observable<Traspaso> {
    return this.http
      .post<Traspaso>(this.apiUrl, ficha)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(ficha: Traspaso) {
    const url = `${this.apiUrl}/${ficha.id}`;
    return this.http
      .delete<Traspaso>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(traspaso: Update<Traspaso>): Observable<Traspaso> {
    const url = `${this.apiUrl}/${traspaso.id}`;
    return this.http
      .put<Traspaso>(url, traspaso.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
