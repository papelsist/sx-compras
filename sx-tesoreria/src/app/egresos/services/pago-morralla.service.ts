import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';
import { PagoDeMorralla } from '../models';

import { Update } from '@ngrx/entity';
import { PeriodoFilter } from 'app/models';
import { Morralla } from '../models/morralla';

@Injectable()
export class PagoDeMorrallaService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('tesoreria/pagoDeMorralla');
  }

  list(filter: PeriodoFilter): Observable<PagoDeMorralla[]> {
    let params = new HttpParams()
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.registros) {
      params = params.set('max', filter.registros.toString());
    }
    return this.http
      .get<PagoDeMorralla[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<PagoDeMorralla> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<PagoDeMorralla>(url)
      .pipe(catchError(err => throwError(err)));
  }

  save(command: PagoDeMorralla): Observable<PagoDeMorralla> {
    return this.http
      .post<PagoDeMorralla>(this.apiUrl, command)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(pago: PagoDeMorralla) {
    const url = `${this.apiUrl}/${pago.id}`;
    return this.http
      .delete<PagoDeMorralla>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(inversion: Update<PagoDeMorralla>): Observable<PagoDeMorralla> {
    const url = `${this.apiUrl}/${inversion.id}`;
    return this.http
      .put<PagoDeMorralla>(url, inversion.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  pendientes(): Observable<Morralla[]> {
    const url = `${this.apiUrl}/pendientes`;
    return this.http
      .get<Morralla[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
