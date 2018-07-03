import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';
import { Analisis } from '../model/analisis';
import { RecepcionDeCompra } from '../model/recepcionDeCompra';
import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class AnalisisService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('analisisDeFactura');
  }

  list(filtro: any = {}): Observable<Analisis[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      if (value instanceof Periodo) {
        const per = value.toApiJSON();
        params = params.set('fechaInicial', per.fechaInicial);
        params = params.set('fechaFinal', per.fechaFinal);
      } else {
        params = params.set(key, value);
      }
    });
    return this.http
      .get<Analisis[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Analisis> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Analisis>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(analisis: Analisis): Observable<Analisis> {
    return this.http
      .post<Analisis>(this.apiUrl, analisis)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(analisis: Analisis): Observable<Analisis> {
    const url = `${this.apiUrl}/${analisis.id}`;
    return this.http
      .put<Analisis>(url, analisis)
      .pipe(catchError((error: any) => throwError(error)));
  }

  cerrar(analisis: Analisis): Observable<Analisis> {
    const url = `${this.apiUrl}/cerrar/${analisis.id}`;
    return this.http
      .put<Analisis>(url, analisis)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  comsPendientes(proveedorId: string): Observable<RecepcionDeCompra[]> {
    const url = this.configService.buildApiUrl(
      `coms/pendientesDeAnalisis/${proveedorId}`
    );
    return this.http
      .get<RecepcionDeCompra[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
