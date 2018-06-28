import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';
import { Requisicion } from '../model';


@Injectable()
export class RequisicionDeCompraService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('requisicionesDeCompras');
  }

  list(filtro: any = {}): Observable<Requisicion[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    return this.http
      .get<Requisicion[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Requisicion> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Requisicion>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(requisicion: Requisicion): Observable<Requisicion> {
    return this.http
      .post<Requisicion>(this.apiUrl, requisicion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(requisicion: Requisicion): Observable<Requisicion> {
    const url = `${this.apiUrl}/${requisicion.id}`;
    return this.http
      .put<Requisicion>(url, requisicion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  cerrar(requisicion: Requisicion): Observable<Requisicion> {
    const url = `${this.apiUrl}/cerrar/${requisicion.id}`;
    return this.http
      .put<Requisicion>(url, requisicion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
