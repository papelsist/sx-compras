import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from 'app/utils/config.service';
import { NotaDeCredito, CarteraFilter } from '../models';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class NotaDeCreditoService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('cxc/notas');
  }

  get(id: string): Observable<NotaDeCredito> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<NotaDeCredito>(url);
  }

  list(cartera: string, filter?: CarteraFilter): Observable<NotaDeCredito[]> {
    let params = new HttpParams().set('tipo', cartera);
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
      .get<NotaDeCredito[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(nota: NotaDeCredito): Observable<NotaDeCredito> {
    return this.http
      .post<NotaDeCredito>(this.apiUrl, nota)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(nota: Update<NotaDeCredito>): Observable<NotaDeCredito> {
    const url = `${this.apiUrl}/${nota.id}`;
    return this.http
      .put<NotaDeCredito>(url, nota.changes)
      .pipe(catchError(error => throwError(error)));
  }

  delete(notaId: string): Observable<any> {
    const url = `${this.apiUrl}/${notaId}`;
    return this.http.delete(url).pipe(catchError(error => throwError(error)));
  }
}
