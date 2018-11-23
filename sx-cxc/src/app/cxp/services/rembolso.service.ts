import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { Rembolso, RembolsosFilter } from '../model';

@Injectable()
export class RembolsoService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('rembolsos');
  }

  list(filter: RembolsosFilter): Observable<Rembolso[]> {
    let params = new HttpParams()
      .set('registros', filter.registros.toString())
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.sucursal) {
      params = params.set('sucursal', filter.sucursal.id);
    }
    return this.http
      .get<Rembolso[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Rembolso> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Rembolso>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(rembolso: Rembolso): Observable<Rembolso> {
    return this.http
      .post<Rembolso>(this.apiUrl, rembolso)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: {
    id: string | number;
    changes: Partial<Rembolso>;
  }): Observable<Rembolso> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Rembolso>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
