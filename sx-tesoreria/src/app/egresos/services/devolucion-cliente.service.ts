import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';

import { PeriodoFilter } from 'app/models';
import { DevolucionCliente } from '../models';
import { Cobro } from 'app/ingresos/models';

@Injectable()
export class DevolucionClienteService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('tesoreria/devoluciones');
  }

  list(filter: PeriodoFilter): Observable<DevolucionCliente[]> {
    let params = new HttpParams()
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.registros) {
      params = params.set('max', filter.registros.toString());
    }
    return this.http
      .get<DevolucionCliente[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<DevolucionCliente> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<DevolucionCliente>(url)
      .pipe(catchError(err => throwError(err)));
  }

  save(command: DevolucionCliente): Observable<DevolucionCliente> {
    return this.http
      .post<DevolucionCliente>(this.apiUrl, command)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(devo: DevolucionCliente) {
    const url = `${this.apiUrl}/${devo.id}`;
    return this.http
      .delete<DevolucionCliente>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  cobros(clienteId: string): Observable<Cobro[]> {
    const url = `${this.apiUrl}/cobros/${clienteId}`;
    return this.http
      .get<any[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  generarCheqye(devoId: number): Observable<any[]> {
    const url = `${this.apiUrl}/generarCheque/${devoId}`;
    return this.http
      .put<any[]>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }
}
