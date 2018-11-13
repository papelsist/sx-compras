import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';
import { PagoDeNomina } from '../models';

import { Update } from '@ngrx/entity';
import { PeriodoFilter } from 'app/models';

@Injectable()
export class PagoDeNominaMonedaService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('tesoreria/pagoDeNomina');
  }

  list(filter: PeriodoFilter): Observable<PagoDeNomina[]> {
    let params = new HttpParams()
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.registros) {
      params = params.set('registros', filter.registros.toString());
    }
    return this.http
      .get<PagoDeNomina[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<PagoDeNomina> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<PagoDeNomina>(url)
      .pipe(catchError(err => throwError(err)));
  }

  save(pago: PagoDeNomina): Observable<PagoDeNomina> {
    return this.http
      .post<PagoDeNomina>(this.apiUrl, pago)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(pago: PagoDeNomina) {
    const url = `${this.apiUrl}/${pago.id}`;
    return this.http
      .delete<PagoDeNomina>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(inversion: Update<PagoDeNomina>): Observable<PagoDeNomina> {
    const url = `${this.apiUrl}/${inversion.id}`;
    return this.http
      .put<PagoDeNomina>(url, inversion.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
