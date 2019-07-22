import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from '../../utils/config.service';

import { RecepcionDeCompra, ComsFilter } from '../models';
import { Compra } from '../../ordenes/models/compra';

@Injectable()
export class RecepcionesService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('coms');
  }

  list(filter?: ComsFilter): Observable<RecepcionDeCompra[]> {
    let params = new HttpParams();
    _.forIn(filter, (value: any, key) => {
      if (value instanceof Date) {
        const fecha: Date = value;
        params = params.set(key, fecha.toISOString());
      } else {
        params = params.set(key, value);
      }
      if (filter.proveedor) {
        params = params.set('proveedorId', filter.proveedor.id);
      }
    });
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
