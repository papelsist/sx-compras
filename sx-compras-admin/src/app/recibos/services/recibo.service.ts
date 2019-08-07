import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { Periodo } from 'app/_core/models/periodo';
import { ConfigService } from 'app/utils/config.service';

import { Update } from '@ngrx/entity';
import { Recibo } from '../models';

@Injectable({ providedIn: 'root' })
export class ReciboService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('reciboElectronico');
  }

  list(periodo: Periodo): Observable<Recibo[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<Recibo[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Recibo> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Recibo>(url);
  }

  save(requisicion: Partial<Recibo>): Observable<Recibo> {
    return this.http.post<Recibo>(this.apiUrl, requisicion);
  }

  update(update: Update<Recibo>): Observable<Recibo> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Recibo>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(requisicionId: number) {
    const url = `${this.apiUrl}/${requisicionId}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicar(requisicionId: number): Observable<Recibo> {
    const url = `${this.apiUrl}/aplicar/${requisicionId}`;
    return this.http
      .put<Recibo>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  disponibles(): Observable<any[]> {
    const url = `${this.apiUrl}/disponibles`;
    return this.http
      .get<any[]>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  getUrl(proveedorId: string) {
    return this.configService.buildApiUrl(
      `proveedores/${proveedorId}/productos`
    );
  }

  mostrarXml(recibo: Partial<Recibo>): Observable<any> {
    const base = this.configService.buildApiUrl('comprobanteFiscal');
    const url = `${base}/xml/${recibo.cfdi.id}`;
    const headers = new HttpHeaders().set('Content-type', 'text/xml');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob'
    });
  }
}
