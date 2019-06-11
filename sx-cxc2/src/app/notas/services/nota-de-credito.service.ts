import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Update } from '@ngrx/entity';

import { ConfigService } from 'app/utils/config.service';
import {
  NotaDeCredito,
  Bonificacion,
  Devolucion,
  CarteraFilter
} from 'app/cobranza/models';

@Injectable({
  providedIn: 'root'
})
export class NotaDeCreditoService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('cxc/notas');
  }

  get(id: string): Observable<NotaDeCredito | Bonificacion | Devolucion> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<NotaDeCredito>(url);
  }

  list(
    cartera: string,
    filter?: CarteraFilter
  ): Observable<NotaDeCredito[] | Bonificacion[] | Devolucion[]> {
    let params = new HttpParams().set('cartera', cartera);
    if (filter) {
      params = params
        .set('registros', filter.registros.toString())
        .set('fechaInicial', filter.fechaInicial.toISOString())
        .set('fechaFinal', filter.fechaFinal.toISOString());
      if (filter.nombre) {
        params = params.set('nombre', filter.nombre);
      }
    }
    return this.http
      .get<NotaDeCredito[] | Bonificacion[] | Devolucion[]>(this.apiUrl, {
        params: params
      })
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(
    nota: Partial<NotaDeCredito>
  ): Observable<NotaDeCredito | Bonificacion | Devolucion> {
    return this.http
      .post<NotaDeCredito>(this.apiUrl, nota)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(
    nota: Update<NotaDeCredito | Bonificacion | Devolucion>
  ): Observable<NotaDeCredito | Bonificacion | Devolucion> {
    const url = `${this.apiUrl}/${nota.id}`;
    return this.http
      .put<NotaDeCredito>(url, nota.changes)
      .pipe(catchError(error => throwError(error)));
  }

  delete(notaId: string): Observable<any> {
    const url = `${this.apiUrl}/${notaId}`;
    return this.http.delete(url).pipe(catchError(error => throwError(error)));
  }

  buscarFacturasPendientes(filtro?): Observable<any> {
    const url = this.apiUrl + '/buscarFacturasPendientes';
    return this.http.get<any>(url);
  }

  gemerarCfdi(
    notaId: string
  ): Observable<NotaDeCredito | Bonificacion | Devolucion> {
    const url = `${this.apiUrl}/generarCfdi/${notaId}`;
    return this.http
      .post<NotaDeCredito>(url, {})
      .pipe(catchError(error => throwError(error)));
  }

  aplicar(
    notaId: string
  ): Observable<NotaDeCredito | Bonificacion | Devolucion> {
    const url = `${this.apiUrl}/aplicar/${notaId}`;
    return this.http
      .put<NotaDeCredito>(url, {})
      .pipe(catchError(error => throwError(error)));
  }
}
