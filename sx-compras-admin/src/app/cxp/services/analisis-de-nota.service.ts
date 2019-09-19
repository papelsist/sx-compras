import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';

import { AnalisisDeNota } from '../model';
import { Update } from '@ngrx/entity';

@Injectable({ providedIn: 'root' })
export class AnalisisDeNotaService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cxp/notas');
  }

  list(notaId: string): Observable<AnalisisDeNota[]> {
    const url = `${this.apiUrl}/${notaId}/analisis`;
    return this.http
      .get<AnalisisDeNota[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<AnalisisDeNota> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<AnalisisDeNota>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(
    notaId: string,
    analisis: Partial<AnalisisDeNota>
  ): Observable<AnalisisDeNota> {
    const url = `${this.apiUrl}/${notaId}/analisis`;
    return this.http
      .post<AnalisisDeNota>(url, analisis)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(
    notaId: string,
    analisis: Update<AnalisisDeNota>
  ): Observable<AnalisisDeNota> {
    const url = `${this.apiUrl}/${notaId}/analisis/${analisis.id}`;
    return this.http
      .put<AnalisisDeNota>(url, analisis.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(notaId: string, analisisId: number) {
    const url = `${this.apiUrl}/${notaId}/analisis/${analisisId}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  devolucionesPendientes(proveedorId: string): Observable<any[]> {
    const url = `${this.apiUrl}/devolucionesPendientes`;
    const params = new HttpParams().set('proveedorId', proveedorId);
    return this.http
      .get<any[]>(url, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  cerrarAnalisis(notaId: string): Observable<any> {
    const url = `${this.apiUrl}/${notaId}`;
    return this.http
      .put<any>(url, { cierreDeAnalisis: new Date().toISOString() })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
