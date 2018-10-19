import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';
import { Contrarecibo, CuentaPorPagar } from '../model';
import { Periodo } from '../../_core/models/periodo';
import { ProveedorPeriodoFilter } from '../model/proveedorPeriodoFilter';

@Injectable()
export class ContrareciboService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cxp/contrarecibos');
  }

  list2(): Observable<Contrarecibo[]> {
    const params = new HttpParams();
    return this.http
      .get<Contrarecibo[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  list(filter: ProveedorPeriodoFilter): Observable<Contrarecibo[]> {
    let params = new HttpParams()
      .set('registros', filter.registros.toString())
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.proveedor) {
      params = params.set('proveedor', filter.proveedor.id);
    }
    return this.http
      .get<Contrarecibo[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  pendientes(proveedorId: string): Observable<CuentaPorPagar[]> {
    const url = `${this.apiUrl}/pendientes/${proveedorId}`;
    return this.http
      .get<CuentaPorPagar[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(recibo: Contrarecibo): Observable<Contrarecibo> {
    return this.http
      .post<Contrarecibo>(this.apiUrl, recibo)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(contrareibo: Contrarecibo): Observable<Contrarecibo> {
    console.log('Salvando: ', contrareibo);
    const url = `${this.apiUrl}/${contrareibo.id}`;
    return this.http
      .put<Contrarecibo>(url, contrareibo)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Contrarecibo> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Contrarecibo>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
