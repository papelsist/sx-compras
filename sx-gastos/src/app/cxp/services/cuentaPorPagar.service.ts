import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';
import { CuentaPorPagar, CxPFilter } from '../model/cuentaPorPagar';
import { Update } from '@ngrx/entity';

@Injectable()
export class CuentaPorPagarService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cuentaPorPagar');
  }

  list(filtro: CxPFilter): Observable<CuentaPorPagar[]> {
    let params = new HttpParams()
      .set('tipo', 'GASTOS')
      .set('fechaInicial', filtro.fechaInicial.toISOString())
      .set('fechaFinal', filtro.fechaFinal.toISOString());
    if (filtro.proveedor) {
      params = params.set('proveedor', filtro.proveedor.id);
    }
    return this.http
      .get<CuentaPorPagar[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  pendientesDeAnalizar(proveedorId: string): Observable<CuentaPorPagar[]> {
    const url = `${this.apiUrl}/pendientesDeAnalisis/${proveedorId}`;
    return this.http
      .get<CuentaPorPagar[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(factura: Update<CuentaPorPagar>): Observable<CuentaPorPagar> {
    const url = `${this.apiUrl}/${factura.id}`;
    return this.http
      .put<CuentaPorPagar>(url, factura.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  saldar(factura: CuentaPorPagar): Observable<CuentaPorPagar> {
    const url = `${this.apiUrl}/${factura.id}/saldar`;
    return this.http
      .put<CuentaPorPagar>(url, factura)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<CuentaPorPagar> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<CuentaPorPagar>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  pendientes(proveedorId: string) {
    const url = `${this.apiUrl}/pendientes/${proveedorId}`;
    return this.http
      .get<CuentaPorPagar[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
