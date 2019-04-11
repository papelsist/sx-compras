import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';
import { SolicitudDeDeposito, CarteraFilter } from '../models';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('tesoreria/solicitudes');
  }

  get(id: string): Observable<SolicitudDeDeposito> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<SolicitudDeDeposito>(url);
  }

  list(
    cartera: string,
    filter?: CarteraFilter
  ): Observable<SolicitudDeDeposito[]> {
    let params = new HttpParams().set('cartera', cartera);
    if (filter) {
      params = params
        .set('max', filter.registros.toString())
        .set('fechaInicial', filter.fechaInicial.toISOString())
        .set('fechaFinal', filter.fechaFinal.toISOString())
        .set('sort', 'lastUpdated')
        .set('order', 'desc');
      if (filter.nombre) {
        params = params.set('nombre', filter.nombre);
      }
    }

    return this.http
      .get<SolicitudDeDeposito[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(solicitud: SolicitudDeDeposito): Observable<SolicitudDeDeposito> {
    return this.http
      .post<SolicitudDeDeposito>(this.apiUrl, solicitud)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<SolicitudDeDeposito>): Observable<SolicitudDeDeposito> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<SolicitudDeDeposito>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
