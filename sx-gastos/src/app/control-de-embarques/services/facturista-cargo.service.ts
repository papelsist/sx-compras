import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { Periodo } from 'app/_core/models/periodo';
import { FacturistaCargo } from '../model';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class FacturistaCargoService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('embarques/facturistaOtroCargo');
  }

  list(
    periodo: Periodo = Periodo.mesActual(),
    registros: number = 50
  ): Observable<FacturistaCargo[]> {
    const params = new HttpParams()
      .set('registros', registros.toString())
      .set('fechaInicial', periodo.fechaInicial.toISOString())
      .set('fechaFinal', periodo.fechaFinal.toISOString());
    return this.http
      .get<FacturistaCargo[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<FacturistaCargo> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<FacturistaCargo>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(cargo: FacturistaCargo): Observable<FacturistaCargo> {
    return this.http
      .post<FacturistaCargo>(this.apiUrl, cargo)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<FacturistaCargo>): Observable<FacturistaCargo> {
    console.log('Update: ', update);
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<FacturistaCargo>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
