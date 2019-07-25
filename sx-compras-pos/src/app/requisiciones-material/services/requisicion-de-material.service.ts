import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { Periodo } from 'app/_core/models/periodo';
import { ConfigService } from 'app/utils/config.service';
import { RequisicionDeMaterial } from '../models';
import { Update } from '@ngrx/entity';

@Injectable({ providedIn: 'root' })
export class RequisicionDeMaterialService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('requisicionDeMaterial');
  }

  list(periodo: Periodo): Observable<RequisicionDeMaterial[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<RequisicionDeMaterial[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<RequisicionDeMaterial> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<RequisicionDeMaterial>(url);
  }

  save(
    requisicion: Partial<RequisicionDeMaterial>
  ): Observable<RequisicionDeMaterial> {
    return this.http.post<RequisicionDeMaterial>(this.apiUrl, requisicion);
  }

  update(
    update: Update<RequisicionDeMaterial>
  ): Observable<RequisicionDeMaterial> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<RequisicionDeMaterial>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(requisicionId: string) {
    const url = `${this.apiUrl}/${requisicionId}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  disponibles(proveedor: string, moneda: string  ): Observable<any[]> {
    const url = `${this.apiUrl}/disponibles`;
    const params = new HttpParams()
    .set('proveedor', proveedor)
    .set('moneda', moneda);
    return this.http.get<any[]>(url, { params: params });
  }

  getUrl(proveedorId: string) {
    return this.configService.buildApiUrl(
      `proveedores/${proveedorId}/productos`
    );
  }
}
