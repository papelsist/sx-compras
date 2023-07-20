import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { Periodo } from 'app/_core/models/periodo';
import { ConfigService } from 'app/utils/config.service';

import { Update } from '@ngrx/entity';
import { Existencia } from '../models';

@Injectable({ providedIn: 'root' })
export class ExistenciaService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('existencias');
  }

  list(periodo: Periodo = Periodo.mesActual()): Observable<Existencia[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<Existencia[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  crossTab() {
    const url = `${this.apiUrl}/crossTab`;
    return this.http
      .get<Existencia[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Existencia> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Existencia>(url);
  }

  save(exis: Partial<Existencia>): Observable<Existencia> {
    return this.http.post<Existencia>(this.apiUrl, exis);
  }

  update(update: Update<Existencia>): Observable<Existencia> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Existencia>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  existenciaSemana(parameters) {
    /* console.log('Ejecutando el reporte por semana');
    const url = `${this.apiUrl}/`;
    return this.http.post(this.apiUrl, params); */

    let params = new HttpParams();
    _.forIn(parameters, (value, key) => {
      params = params.set(key, value);
    });
    const url = `${this.apiUrl}/existenciaPorSemana`;
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob',
      params: params
    });
  }
}
