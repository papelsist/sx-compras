import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { EnvioComision, EnviosFilter } from '../model';
import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class EnvioComisionService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('embarques/comisiones');
  }

  list(filter: EnviosFilter): Observable<EnvioComision[]> {
    let params = new HttpParams()
      .set('registros', filter.registros.toString())
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.sucursal) {
      params = params.set('sucursal', filter.sucursal.id);
    }
    return this.http
      .get<EnvioComision[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  generar(periodo: Periodo): Observable<EnvioComision[]> {
    const url = `${this.apiUrl}/generar`;
    return this.http
      .post<EnvioComision[]>(url, periodo.toApiJSON())
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<EnvioComision> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<EnvioComision>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(rembolso: EnvioComision): Observable<EnvioComision> {
    return this.http
      .post<EnvioComision>(this.apiUrl, rembolso)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: {
    id: string | number;
    changes: Partial<EnvioComision>;
  }): Observable<EnvioComision> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<EnvioComision>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
