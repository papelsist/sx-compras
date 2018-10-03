import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';
import { Requisicion, RequisicionesFilter } from '../models';
import { PagoDeRequisicion } from '../models/pagoDeRequisicion';

@Injectable()
export class GastosService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('requisiciones/gastos');
  }

  list(filtro: RequisicionesFilter): Observable<Requisicion[]> {
    let params = new HttpParams()
      .set('tipo', 'GASTOS')
      .set('cerradas', 'true')
      .set('fechaInicial', filtro.fechaInicial.toISOString())
      .set('fechaFinal', filtro.fechaFinal.toISOString())
      .set('pendientes', filtro.pendientes.toString())
      .set('registros', filtro.registros.toString() || '20');
    if (filtro.proveedor) {
      params = params.set('proveedor', filtro.proveedor.id);
    }
    return this.http
      .get<Requisicion[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Requisicion> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Requisicion>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  pagar(pago: PagoDeRequisicion): Observable<Requisicion> {
    const url = `${this.apiUrl}/pagar`;
    return this.http
      .put<Requisicion>(url, pago)
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelarPago(id: string) {
    const url = `${this.apiUrl}/cancelarPago/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
