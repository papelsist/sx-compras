import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';
import { CfdiCancelado, CfdisFilter, Cfdi } from '../models';

import * as _ from 'lodash';

@Injectable()
export class CfdisCanceladosService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cfdi/cancelacion');
  }

  get(id: string): Observable<CfdiCancelado> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<CfdiCancelado>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(cfdi: CfdiCancelado): Observable<CfdiCancelado> {
    const url = `${this.apiUrl}/${cfdi.id}`;
    return this.http
      .put<CfdiCancelado>(url, cfdi)
      .pipe(catchError((error: any) => throwError(error)));
  }

  list(filtro: CfdisFilter): Observable<CfdiCancelado[]> {
    let params = new HttpParams();
    params = params
      .set('fechaInicial', filtro.fechaInicial.toISOString())
      .set('fechaFinal', filtro.fechaFinal.toISOString())
      .set('max', filtro.registros.toString());
    if (filtro.receptor) {
      params = params.set('receptor', filtro.receptor);
    }
    return this.http
      .get<CfdiCancelado[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  pendientes(): Observable<Cfdi[]> {
    const url = `${this.apiUrl}/pendientes`;
    return this.http
      .get<Cfdi[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelar(cfdi: Cfdi): Observable<CfdiCancelado> {
    const url = `${this.apiUrl}/cancelar/${cfdi.id}`;
    return this.http
      .put<CfdiCancelado>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  mostrarAcuse(cancelacion: Partial<CfdiCancelado>) {
    const url = `${this.apiUrl}/mostrarAcuse/${cancelacion.id}`;
    const headers = new HttpHeaders().set('Content-type', 'text/xml');
    this.http
      .get(url, {
        headers: headers,
        responseType: 'blob'
      })
      .subscribe(
        res => {
          const blob = new Blob([res], {
            type: 'text/xml'
          });
          const fileURL = window.URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        },
        error => console.error('Error mostrando acuse ', error)
      );
  }

  descargarAcuse(cancelacion: Partial<CfdiCancelado>): Observable<any> {
    const url = `${this.apiUrl}/descargarAcuse/${cancelacion.id}`;
    const headers = new HttpHeaders().set('Content-type', 'text/xml');
    return this.http
      .get(url, {
        headers: headers,
        responseType: 'blob'
      })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
