import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { Periodo } from 'app/_core/models/periodo';
import { FacturistaPrestamo } from '../model';
import { Update } from '@ngrx/entity';

@Injectable()
export class FacturistaPrestamoService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('embarques/facturistaPrestamo');
  }

  list(
    periodo: Periodo = Periodo.mesActual(),
    registros: number = 50
  ): Observable<FacturistaPrestamo[]> {
    const params = new HttpParams()
      .set('registros', registros.toString())
      .set('fechaInicial', periodo.fechaInicial.toISOString())
      .set('fechaFinal', periodo.fechaFinal.toISOString());
    return this.http
      .get<FacturistaPrestamo[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<FacturistaPrestamo> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<FacturistaPrestamo>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(rembolso: FacturistaPrestamo): Observable<FacturistaPrestamo> {
    return this.http
      .post<FacturistaPrestamo>(this.apiUrl, rembolso)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<FacturistaPrestamo>): Observable<FacturistaPrestamo> {
    console.log('Update: ', update);
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<FacturistaPrestamo>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
