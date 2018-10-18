import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';
import { CuentaDeBanco } from 'app/models';
import { Update } from '@ngrx/entity';
import { Movimiento } from '../models/movimiento';
import { SaldoPorCuenta } from '../models/saldoPorCuenta';

@Injectable()
export class CuentasService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('tesoreria/cuentas');
  }

  list(): Observable<CuentaDeBanco[]> {
    return this.http
      .get<CuentaDeBanco[]>(this.apiUrl)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<CuentaDeBanco> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<CuentaDeBanco>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(cuenta: Update<CuentaDeBanco>): Observable<CuentaDeBanco> {
    const url = `${this.apiUrl}/${cuenta.id}`;
    return this.http
      .put<CuentaDeBanco>(url, cuenta.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  loadMovimientos(cuenta: CuentaDeBanco): Observable<Movimiento[]> {
    const url = `${this.apiUrl}/${cuenta.id}/movimientos`;
    return this.http
      .get<Movimiento[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  loadSaldos(cuenta: CuentaDeBanco): Observable<SaldoPorCuenta[]> {
    const url = `${this.apiUrl}/${cuenta.id}/saldos`;
    return this.http
      .get<SaldoPorCuenta[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
