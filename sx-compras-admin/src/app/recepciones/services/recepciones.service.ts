import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from '../../utils/config.service';

import { RecepcionDeCompra, ComsFilter } from '../models';
import { Compra } from '../../ordenes/models/compra';
import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class RecepcionesService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('coms');
  }

  list(periodo: Periodo): Observable<RecepcionDeCompra[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<RecepcionDeCompra[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<RecepcionDeCompra> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<RecepcionDeCompra>(url);
  }

  getComprasPendientes(proveedorId: string): Observable<Compra[]> {
    const url = `${this.configService.buildApiUrl(
      'compras/pendientes'
    )}/${proveedorId}`;
    return this.http
      .get<Compra[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  partidas(coms: string[]): Observable<any[]> {
    const url = `${this.apiUrl}/partidas`;
    const params = new HttpParams().set(
      'ids',
      coms.reduce((prev, item) => prev + ',' + item)
    );
    return this.http.get<any[]>(url, { params });
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
