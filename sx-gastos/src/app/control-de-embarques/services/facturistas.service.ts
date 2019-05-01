import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { FacturistaDeEmbarque } from '../model';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class FacturistaService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('embarques/facturistas');
  }

  list(): Observable<FacturistaDeEmbarque[]> {
    const params = new HttpParams().set('max', '100').set('sort', 'nombre');
    return this.http
      .get<FacturistaDeEmbarque[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<FacturistaDeEmbarque> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<FacturistaDeEmbarque>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(
    facturista: Partial<FacturistaDeEmbarque>
  ): Observable<FacturistaDeEmbarque> {
    return this.http
      .post<FacturistaDeEmbarque>(this.apiUrl, facturista)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(
    facturista: Update<FacturistaDeEmbarque>
  ): Observable<FacturistaDeEmbarque> {
    const url = `${this.apiUrl}/${facturista.id}`;
    return this.http
      .put<FacturistaDeEmbarque>(url, facturista)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(facturistaId: string): Observable<any> {
    const url = `${this.apiUrl}/${facturistaId}`;
    return this.http
      .delete<any>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
