import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';
import { VentaFilter } from '../models/venta-filter';

@Injectable()
export class VentasService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('bi');
  }

  ventaNetaMensual(command: VentaFilter): Observable<any[]> {
    const url = `${this.apiUrl}/ventaNetaMensual`;
    const params = new HttpParams()
      .set('fechaInicial', command.fechaInicial.toISOString())
      .set('fechaFinal', command.fechaFinal.toISOString())
      .set('clasificacion', command.clasificacion)
      .set('tipo', command.tipo)
      .set('tipoVenta', command.tipoVenta);
    return this.http
      .get<any[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  movimientoCosteado(command: VentaFilter, origenId: any): Observable<any[]> {
    const url = `${this.apiUrl}/movimientoCosteado`;
    const params = new HttpParams()
      .set('fechaInicial', command.fechaInicial.toISOString())
      .set('fechaFinal', command.fechaFinal.toISOString())
      .set('clasificacion', command.clasificacion)
      .set('tipo', command.tipo)
      .set('tipoVenta', command.tipoVenta)
      .set('id', origenId);
    return this.http
      .get<any[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  movimientoCosteadoDet(
    command: VentaFilter,
    origenId: any,
    clave: string
  ): Observable<any[]> {
    const url = `${this.apiUrl}/movimientoCosteadoDet`;
    const params = new HttpParams()
      .set('fechaInicial', command.fechaInicial.toISOString())
      .set('fechaFinal', command.fechaFinal.toISOString())
      .set('clasificacion', command.clasificacion)
      .set('tipo', command.tipo)
      .set('tipoVenta', command.tipoVenta)
      .set('id', origenId)
      .set('clave', clave);
    return this.http
      .get<any[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
