import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';
import { Comision } from '../models';

import { Update } from '@ngrx/entity';
import { PeriodoFilter } from 'app/models';

@Injectable()
export class ComisionService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('tesoreria/comisiones');
  }

  list(filter: PeriodoFilter): Observable<Comision[]> {
    let params = new HttpParams()
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.registros) {
      params = params.set('registros', filter.registros.toString());
    }
    return this.http
      .get<Comision[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Comision> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Comision>(url)
      .pipe(catchError(err => throwError(err)));
  }

  save(comision: Comision): Observable<Comision> {
    return this.http
      .post<Comision>(this.apiUrl, comision)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(comision: Comision) {
    const url = `${this.apiUrl}/${comision.id}`;
    return this.http
      .delete<Comision>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(inversion: Update<Comision>): Observable<Comision> {
    const url = `${this.apiUrl}/${inversion.id}`;
    return this.http
      .put<Comision>(url, inversion.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
