import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from 'app/utils/config.service';
import { Cliente } from '../models/cliente';

@Injectable()
export class ClienteService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('clientes');
  }

  get(id: string): Observable<Cliente> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Cliente>(url);
  }

  list(filtro?: any): Observable<Cliente[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    return this.http
      .get<Cliente[]>(this.apiUrl, { params: params })
      .pipe(catchError(error => observableOf(error)));
  }

  facturas(cliente: Cliente, filtro?: any): Observable<Cliente[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    const url = `${this.apiUrl}/${cliente.id}/facturas`;
    return this.http.get<Cliente[]>(url, { params: params });
  }

  estadoDeCuenta(cliente: Cliente, fecha: Date, cartera: string) {
    const url = `${this.apiUrl}/estadoDeCuenta`;
    const params = new HttpParams()
      .set('fecha', fecha.toISOString())
      .set('cartera', cartera)
      .set('cliente', cliente.id);
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(url, {
      headers: headers,
      params: params,
      responseType: 'blob'
    });
  }
}
