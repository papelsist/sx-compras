import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { FacturistaEstadoDeCuenta, FacturistaDeEmbarque } from '../model';

@Injectable({
  providedIn: 'root'
})
export class EstadoDeCuentaService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl(
      'embarques/facturistaEstadoDeCuenta'
    );
  }

  list(facturistaId: string): Observable<FacturistaEstadoDeCuenta[]> {
    const params = new HttpParams()
      .set('facturistaId', facturistaId)
      .set('sort', 'lastUpdated')
      .set('order', 'desc');
    return this.http
      .get<FacturistaEstadoDeCuenta[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  calcularIntereses(payload: {
    corte: string;
    tasa: number;
    facturista?: string;
  }): Observable<FacturistaEstadoDeCuenta[]> {
    const url = `${this.apiUrl}/calcularIntereses`;
    return this.http
      .post<FacturistaEstadoDeCuenta[]>(url, payload)
      .pipe(catchError(error => throwError(error)));
  }

  generarNotaDeCargo(facturistaId: string): Observable<any> {
    const url = `${this.apiUrl}/generarNotaDeCargo/${facturistaId}`;
    return this.http.put(url, {}).pipe(catchError(error => throwError(error)));
  }
}
