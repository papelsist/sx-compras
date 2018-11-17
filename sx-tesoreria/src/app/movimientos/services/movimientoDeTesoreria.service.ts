import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from '../../utils/config.service';
import { MovimientoDeTesoreria } from '../models';

import { Update } from '@ngrx/entity';
import { PeriodoFilter } from 'app/models';

@Injectable()
export class MovimientoDeTesoreriaService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('tesoreria/movimientos');
  }

  list(filter: PeriodoFilter): Observable<MovimientoDeTesoreria[]> {
    let params = new HttpParams()
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.registros) {
      params = params.set('registros', filter.registros.toString());
    }
    return this.http
      .get<MovimientoDeTesoreria[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<MovimientoDeTesoreria> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<MovimientoDeTesoreria>(url)
      .pipe(catchError(err => throwError(err)));
  }

  save(mov: MovimientoDeTesoreria): Observable<MovimientoDeTesoreria> {
    return this.http
      .post<MovimientoDeTesoreria>(this.apiUrl, mov)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(mov: MovimientoDeTesoreria) {
    const url = `${this.apiUrl}/${mov.id}`;
    return this.http
      .delete<MovimientoDeTesoreria>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(
    inversion: Update<MovimientoDeTesoreria>
  ): Observable<MovimientoDeTesoreria> {
    const url = `${this.apiUrl}/${inversion.id}`;
    return this.http
      .put<MovimientoDeTesoreria>(url, inversion.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
