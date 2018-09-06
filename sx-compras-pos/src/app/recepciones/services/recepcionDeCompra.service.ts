import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from '../../utils/config.service';

import { RecepcionDeCompra } from '../models/recepcionDeCompra';
import { Periodo } from 'app/_core/models/periodo';
import { Compra } from '../../ordenes/models/compra';

@Injectable()
export class RecepcionDeCompraService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('coms');
  }

  list(
    periodo: Periodo = Periodo.fromNow(10)
  ): Observable<RecepcionDeCompra[]> {
    const { fechaInicial, fechaFinal } = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', fechaInicial)
      .set('fechaFinal', fechaFinal);
    return this.http
      .get<RecepcionDeCompra[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<RecepcionDeCompra> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<RecepcionDeCompra>(url);
  }

  save(com: RecepcionDeCompra): Observable<RecepcionDeCompra> {
    return this.http.post<RecepcionDeCompra>(this.apiUrl, com);
  }

  update(com: RecepcionDeCompra): Observable<RecepcionDeCompra> {
    const url = `${this.apiUrl}/${com.id}`;
    return this.http
      .put<RecepcionDeCompra>(url, com)
      .pipe(catchError((error: any) => throwError(error)));
  }

  inventariar(com: RecepcionDeCompra): Observable<RecepcionDeCompra> {
    const url = this.configService.buildApiUrl('coms/inventariar/' + com.id);
    return this.http.put<RecepcionDeCompra>(url, {});
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  getComprasPendientes(proveedorId: string): Observable<Compra[]> {
    const url = `${this.configService.buildApiUrl(
      'compras/pendientes'
    )}/${proveedorId}`;
    return this.http
      .get<Compra[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  print(com: RecepcionDeCompra) {
    const endpoint = `coms/print/${com.id}`;
    const url = this.configService.buildApiUrl(endpoint);
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob'
    });
  }
}
