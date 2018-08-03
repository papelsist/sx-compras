import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';

import { NotaDeCreditoCxP } from '../model/notaDeCreditoCxP';

import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class NotasService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cxp/notas');
  }

  list(periodo: Periodo): Observable<NotaDeCreditoCxP[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<NotaDeCreditoCxP[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<NotaDeCreditoCxP> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<NotaDeCreditoCxP>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(requisicion: NotaDeCreditoCxP): Observable<NotaDeCreditoCxP> {
    return this.http
      .post<NotaDeCreditoCxP>(this.apiUrl, requisicion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(requisicion: NotaDeCreditoCxP): Observable<NotaDeCreditoCxP> {
    const url = `${this.apiUrl}/${requisicion.id}`;
    return this.http
      .put<NotaDeCreditoCxP>(url, requisicion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicar(requisicion: NotaDeCreditoCxP): Observable<NotaDeCreditoCxP> {
    const url = `${this.apiUrl}/aplicar/${requisicion.id}`;
    return this.http
      .put<NotaDeCreditoCxP>(url, requisicion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
