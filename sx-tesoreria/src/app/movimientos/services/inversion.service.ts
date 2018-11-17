import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from '../../utils/config.service';
import { Inversion } from '../models/inversion';
import { TraspasosFilter } from '../models/traspaso';
import { Update } from '@ngrx/entity';

@Injectable()
export class InversionService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('tesoreria/inversiones');
  }

  list(filter: TraspasosFilter): Observable<Inversion[]> {
    let params = new HttpParams()
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.cuenta) {
      params = params.set('cuenta', filter.cuenta.id);
    }
    return this.http
      .get<Inversion[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Inversion> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Inversion>(url)
      .pipe(catchError(err => throwError(err)));
  }

  save(ficha: Inversion): Observable<Inversion> {
    return this.http
      .post<Inversion>(this.apiUrl, ficha)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(ficha: Inversion) {
    const url = `${this.apiUrl}/${ficha.id}`;
    return this.http
      .delete<Inversion>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(inversion: Update<Inversion>): Observable<Inversion> {
    const url = `${this.apiUrl}/${inversion.id}`;
    return this.http
      .put<Inversion>(url, inversion.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  retorno(inversion: Update<Inversion>): Observable<Inversion> {
    console.log('Changes: ', inversion);
    const url = `${this.apiUrl}/retorno/${inversion.id}`;
    return this.http
      .put<Inversion>(url, inversion.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
