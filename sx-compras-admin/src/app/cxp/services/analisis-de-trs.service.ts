import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';

import { AnalisisDeTransformacion, CuentaPorPagar } from '../model';
import { Update } from '@ngrx/entity';
import { Periodo } from 'app/_core/models/periodo';

@Injectable({ providedIn: 'root' })
export class AnalisisDeTrsService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cxp/analisisDeTransformacion');
  }

  list(periodo: Periodo): Observable<AnalisisDeTransformacion[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<AnalisisDeTransformacion[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: number): Observable<AnalisisDeTransformacion> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<AnalisisDeTransformacion>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(
    analisis: Partial<AnalisisDeTransformacion>
  ): Observable<AnalisisDeTransformacion> {
    return this.http
      .post<AnalisisDeTransformacion>(this.apiUrl, analisis)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(
    analisis: Update<AnalisisDeTransformacion>
  ): Observable<AnalisisDeTransformacion> {
    const url = `${this.apiUrl}/${analisis.id}`;
    return this.http
      .put<AnalisisDeTransformacion>(url, analisis.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(analisisId: number) {
    const url = `${this.apiUrl}/${analisisId}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  facturasPendientes(proveedorId: string): Observable<CuentaPorPagar[]> {
    const url = `${this.apiUrl}/pendientesDeAnalisis/${proveedorId}`;
    return this.http
      .get<CuentaPorPagar[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  pendientes(): Observable<any[]> {
    const url = `${this.apiUrl}/pendientes`;
    return this.http
      .get<any[]>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  cerrar(analisisId: number): Observable<AnalisisDeTransformacion> {
    // const url = `${this.apiUrl}/cerrar/${analisisId}`;
    const url = `${this.apiUrl}/${analisisId}`;
    return this.http
      .put<AnalisisDeTransformacion>(url, { cerrada: new Date().toISOString() })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
