import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { Pago, AplicacionDePago } from '../model';

import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class PagosService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cxp/pagos');
  }

  list(periodo: Periodo = Periodo.fromNow(10)): Observable<Pago[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<Pago[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Pago> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Pago>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(pago: Pago): Observable<Pago> {
    return this.http
      .post<Pago>(this.apiUrl, pago)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(pago: Pago): Observable<Pago> {
    const url = `${this.apiUrl}/${pago.id}`;
    return this.http
      .put<Pago>(url, pago)
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicar(pago: Pago): Observable<Pago> {
    const url = `${this.apiUrl}/aplicar/${pago.id}`;
    return this.http
      .put<Pago>(url, pago)
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicaciones(pago: Pago): Observable<AplicacionDePago[]> {
    const url = `${this.apiUrl}/${pago.id}/aplicaciones`;
    return this.http
      .get<AplicacionDePago[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
