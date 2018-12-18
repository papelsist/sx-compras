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
    this.apiUrl = configService.buildApiUrl('cfdiCancelado');
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
}
