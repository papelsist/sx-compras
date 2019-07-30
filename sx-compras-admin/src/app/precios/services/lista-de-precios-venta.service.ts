import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { Periodo } from 'app/_core/models/periodo';
import { ConfigService } from 'app/utils/config.service';

import { Update } from '@ngrx/entity';
import { ListaDePreciosVenta } from '../models';

@Injectable({ providedIn: 'root' })
export class ListaDePreciosVentaService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('listaDePreciosVenta');
  }

  list(periodo: Periodo): Observable<ListaDePreciosVenta[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<ListaDePreciosVenta[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<ListaDePreciosVenta> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ListaDePreciosVenta>(url);
  }

  save(
    requisicion: Partial<ListaDePreciosVenta>
  ): Observable<ListaDePreciosVenta> {
    return this.http.post<ListaDePreciosVenta>(this.apiUrl, requisicion);
  }

  update(update: Update<ListaDePreciosVenta>): Observable<ListaDePreciosVenta> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<ListaDePreciosVenta>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(requisicionId: string) {
    const url = `${this.apiUrl}/${requisicionId}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicar(requisicionId: string): Observable<ListaDePreciosVenta> {
    const url = `${this.apiUrl}/aplicar/${requisicionId}`;
    return this.http
      .put<ListaDePreciosVenta>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  getUrl(proveedorId: string) {
    return this.configService.buildApiUrl(
      `proveedores/${proveedorId}/productos`
    );
  }
}
