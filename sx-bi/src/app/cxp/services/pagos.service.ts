import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { Pago, AplicacionDePago, PagosFilter } from '../model';

@Injectable()
export class PagosService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cxp/pagos');
  }

  list(filter: PagosFilter): Observable<Pago[]> {
    let params = new HttpParams()
      .set('serie', 'RequisicionDeGastos')
      .set('registros', filter.registros.toString())
      .set('porAplicar', filter.porAplicar ? 'true' : 'false')
      .set('reciboPendiente', filter.reciboPendiente ? 'true' : 'false')
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    if (filter.proveedor) {
      params = params.set('proveedor', filter.proveedor.id);
    }
    return this.http
      .get<Pago[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Pago> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Pago>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(pago: Pago): Observable<Pago> {
    return this.http
      .post<Pago>(this.apiUrl, pago)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(pago: Pago): Observable<Pago> {
    const url = `${this.apiUrl}/${pago.id}`;
    return this.http
      .put<Pago>(url, pago)
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicar(pago: Pago): Observable<Pago> {
    const url = `${this.apiUrl}/aplicar/${pago.id}`;
    return this.http
      .put<Pago>(url, pago)
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicaciones(pago: Pago): Observable<AplicacionDePago[]> {
    const url = `${this.apiUrl}/${pago.id}/aplicaciones`;
    return this.http
      .get<AplicacionDePago[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
