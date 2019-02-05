import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';
import { Cfdi, CfdisFilter } from '../models';

import * as _ from 'lodash';

@Injectable()
export class CfdisService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cfdi');
  }

  get(id: string): Observable<Cfdi> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Cfdi>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(cfdi: Cfdi): Observable<Cfdi> {
    const url = `${this.apiUrl}/${cfdi.id}`;
    return this.http
      .put<Cfdi>(url, cfdi)
      .pipe(catchError((error: any) => throwError(error)));
  }

  list(filtro: CfdisFilter): Observable<Cfdi[]> {
    let params = new HttpParams();
    params = params
      .set('fechaInicial', filtro.fechaInicial.toISOString())
      .set('fechaFinal', filtro.fechaFinal.toISOString())
      .set('max', filtro.registros.toString());
    if (filtro.receptor) {
      params = params.set('receptor', filtro.receptor);
    }
    return this.http
      .get<Cfdi[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  mostrarXml(comprobanteFiscal: Partial<Cfdi>) {
    const url = `${this.apiUrl}/xml/${comprobanteFiscal.id}`;
    const headers = new HttpHeaders().set('Content-type', 'text/xml');
    this.http
      .get(url, {
        headers: headers,
        responseType: 'blob'
      })
      .subscribe(res => {
        const blob = new Blob([res], {
          type: 'text/xml'
        });
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      });
  }

  imprimirCfdi(cfdiId: string) {
    const url = `${this.apiUrl}/pdf/${cfdiId}`;
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http
      .get(url, {
        headers: headers,
        responseType: 'blob'
      })
      .subscribe(
        res => {
          const blob = new Blob([res], {
            type: 'application/pdf'
          });
          const fileURL = window.URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        },
        error => console.log('Error ', error)
      );
  }
}
