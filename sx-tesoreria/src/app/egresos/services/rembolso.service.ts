import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { Rembolso, RembolsosFilter } from '../models';
import { PagoDeRembolso } from '../models/pagoDeRembolso';

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

  pagar(pago: PagoDeRembolso): Observable<Rembolso> {
    const url = `${this.apiUrl}/pagar`;
    const payload = {
      ...pago,
      rembolso: pago.rembolso.id
    };
    return this.http
      .put<Rembolso>(url, payload)
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelarPago(rembolso: Rembolso): Observable<Rembolso> {
    const url = `${this.apiUrl}/cancelarPago/${rembolso.id}`;
    return this.http
      .put<Rembolso>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelarCheque(rembolsoId: number, comentario: string): Observable<Rembolso> {
    const url = `${this.apiUrl}/cancelarCheque/${rembolsoId}`;
    const params = new HttpParams().set('comentario', comentario);
    return this.http
      .put<Rembolso>(url, {}, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  generarCheque(rembolso: Rembolso): Observable<Rembolso> {
    const url = `${this.apiUrl}/generarCheque/${rembolso.id}`;
    return this.http
      .put<Rembolso>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }
}
