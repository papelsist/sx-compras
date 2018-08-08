import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';
import { Contrarecibo, CuentaPorPagar } from '../model';
import { Periodo } from '../../_core/models/periodo';

@Injectable()
export class ContrareciboService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cxp/contrarecibos');
  }

  list(periodo: Periodo = Periodo.fromNow(30)): Observable<Contrarecibo[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
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
