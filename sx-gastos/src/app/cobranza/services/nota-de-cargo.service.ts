import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';
import { CarteraFilter, NotaDeCargo, Cartera } from '../models';

import * as _ from 'lodash';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class NotaDeCargoService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('cxc/notasDeCargo');
  }

  list(filter?: CarteraFilter): Observable<NotaDeCargo[]> {
    let params = new HttpParams().set('cartera', 'CHO');
    if (filter) {
      params = params
        .set('fechaInicial', filter.fechaInicial.toISOString())
        .set('fechaFinal', filter.fechaFinal.toISOString());
    }
    return this.http
      .get<NotaDeCargo[]>(this.apiUrl, { params })
      .pipe(catchError(error => throwError(error)));
  }

  get(id: string): Observable<NotaDeCargo> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<NotaDeCargo>(url)
      .pipe(catchError(error => throwError(error)));
  }

  save(nota: Partial<NotaDeCargo>): Observable<NotaDeCargo> {
    return this.http
      .post<NotaDeCargo>(this.apiUrl, nota)
      .pipe(catchError(error => throwError(error)));
  }

  update(nota: Update<NotaDeCargo>): Observable<NotaDeCargo> {
    const url = `${this.apiUrl}/${nota.id}`;
    return this.http
      .put<NotaDeCargo>(url, nota.changes)
      .pipe(catchError(error => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  gemerarNotasDeIntereses(
    fechaInicial: string,
    fechaFinal: string,
    descripcion: string,
    facturista: any = null
  ): Observable<NotaDeCargo[]> {
    const url = `${this.apiUrl}/generarNotasDeCargoPorIntereses`;
    return this.http
      .post<NotaDeCargo[]>(url, {
        fechaInicial,
        fechaFinal,
        descripcion,
        facturista
      })
      .pipe(catchError(error => throwError(error)));
  }
}
