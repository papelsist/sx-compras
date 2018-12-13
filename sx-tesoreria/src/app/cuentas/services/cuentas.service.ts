import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';
import { CuentaDeBanco } from 'app/models';
import { Update } from '@ngrx/entity';
import { Movimiento } from '../models/movimiento';
import { SaldoPorCuenta } from '../models/saldoPorCuenta';
import { EjercicioMes } from 'app/models/ejercicioMes';
import { Periodo } from 'app/_core/models/periodo';
import { EstadoDeCuenta } from '../models/estado-de-cuenta';

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

  loadMovimientos(
    cuentaId: string,
    periodo: EjercicioMes
  ): Observable<Movimiento[]> {
    const url = `${this.apiUrl}/${cuentaId}/movimientos/${periodo.ejercicio}/${
      periodo.mes
    }`;
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

  getSaldo(
    cuentaId: string,
    periodo: EjercicioMes
  ): Observable<SaldoPorCuenta> {
    const url = `${this.apiUrl}/${cuentaId}/saldo/${periodo.ejercicio}/${
      periodo.mes
    }`;
    return this.http
      .get<SaldoPorCuenta>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  getEstadoDeCuenta(
    cuenta: Partial<CuentaDeBanco>,
    periodo: Periodo
  ): Observable<EstadoDeCuenta> {
    const url = `${this.apiUrl}/estadoDeCuenta`;
    const params = new HttpParams()
      .set('cuenta', cuenta.id)
      .set('fechaIni', periodo.fechaInicial.toISOString())
      .set('fechaFin', periodo.fechaFinal.toISOString());
    return this.http
      .get<EstadoDeCuenta>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
