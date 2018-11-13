import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';
import { CompraMoneda } from '../models';

import { Update } from '@ngrx/entity';
import { PeriodoFilter } from 'app/models';

@Injectable()
export class CompraMonedaService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('tesoreria/comprasMoneda');
  }

  list(filter: PeriodoFilter): Observable<CompraMoneda[]> {
    let params = new HttpParams()
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.registros) {
      params = params.set('registros', filter.registros.toString());
    }
    return this.http
      .get<CompraMoneda[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<CompraMoneda> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<CompraMoneda>(url)
      .pipe(catchError(err => throwError(err)));
  }

  save(compra: CompraMoneda): Observable<CompraMoneda> {
    return this.http
      .post<CompraMoneda>(this.apiUrl, compra)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(compra: CompraMoneda) {
    const url = `${this.apiUrl}/${compra.id}`;
    return this.http
      .delete<CompraMoneda>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(inversion: Update<CompraMoneda>): Observable<CompraMoneda> {
    const url = `${this.apiUrl}/${inversion.id}`;
    return this.http
      .put<CompraMoneda>(url, inversion.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  buscarTipoDeCambio(fecha: Date, moneda: string = 'USD'): Observable<any> {
    const url = this.config.buildApiUrl('tesoreria/tipoDeCambio/buscar');
    const p = new HttpParams()
      .set('fecha', fecha.toISOString())
      .set('moneda', moneda);
    return this.http
      .get(url, { params: p })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
