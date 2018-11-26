import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { Cobrador } from '../models';
import { Update } from '@ngrx/entity';

@Injectable()
export class CobradorService {
  private _apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    // this.apiUrl = configService.buildApiUrl('cobradores');
  }

  list(): Observable<Cobrador[]> {
    const params = new HttpParams()
      .set('max', '500')
      .set('sort', 'lastUpdated')
      .set('order', 'desc');
    return this.http
      .get<Cobrador[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Cobrador> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Cobrador>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(cobrador: Partial<Cobrador>): Observable<Cobrador> {
    return this.http
      .post<Cobrador>(this.apiUrl, cobrador)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(cobrador: Cobrador) {
    const url = `${this.apiUrl}/${cobrador.id}`;
    return this.http
      .delete<Cobrador>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<Cobrador>): Observable<Cobrador> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Cobrador>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get apiUrl() {
    if (!this._apiUrl) {
      this._apiUrl = this.config.buildApiUrl('cobradores');
    }
    return this._apiUrl;
  }
}
