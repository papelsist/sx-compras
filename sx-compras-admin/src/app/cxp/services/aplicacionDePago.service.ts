import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { AplicacionDePago, NotaDeCreditoCxP, Pago } from '../model';
import { Periodo } from '../../_core/models/periodo';

@Injectable()
export class AplicacionDePagoService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cxp/aplicaciones');
  }

  list(periodo: Periodo = Periodo.fromNow(30)): Observable<AplicacionDePago[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<AplicacionDePago[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(aplicacion: AplicacionDePago): Observable<AplicacionDePago> {
    return this.http
      .post<AplicacionDePago>(this.apiUrl, aplicacion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(aplicacion: AplicacionDePago): Observable<AplicacionDePago> {
    const url = `${this.apiUrl}/${aplicacion.id}`;
    return this.http
      .put<AplicacionDePago>(url, aplicacion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<AplicacionDePago> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<AplicacionDePago>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(aplicacionId: string): Observable<NotaDeCreditoCxP | Pago> {
    const url = `${this.apiUrl}/${aplicacionId}`;
    return this.http
      .delete<NotaDeCreditoCxP | Pago>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
