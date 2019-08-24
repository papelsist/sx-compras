import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';
import { GastoDet } from '../model';
import { Update } from '@ngrx/entity';

@Injectable({ providedIn: 'root' })
export class GastoDetService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('gastoDet');
  }

  list(facturaId: string): Observable<GastoDet[]> {
    const params = new HttpParams().set('cxpId', facturaId);
    return this.http
      .get<GastoDet[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(gasto: Partial<GastoDet>): Observable<GastoDet> {
    return this.http
      .post<GastoDet>(this.apiUrl, gasto)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(gasto: Update<GastoDet>): Observable<GastoDet> {
    const url = `${this.apiUrl}/${gasto.id}`;
    return this.http
      .put<GastoDet>(url, gasto.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: number): Observable<GastoDet> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<GastoDet>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
  delete(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  prorratearPartida(command: {
    gastoDetId: number;
    data: any;
  }): Observable<GastoDet[]> {
    const url = `${this.apiUrl}/prorratear/${command.gastoDetId}`;
    return this.http
      .put<GastoDet[]>(url, command)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
