import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';
import { ComprobanteFiscal } from '../model/comprobanteFiscal';

import * as _ from 'lodash';
import { CuentaPorPagar } from '../model/cuentaPorPagar';
import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class ComprobanteFiscalService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('comprobanteFiscal');
  }
  get(id: string): Observable<ComprobanteFiscal> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<ComprobanteFiscal>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(cfdi: ComprobanteFiscal): Observable<ComprobanteFiscal> {
    const url = `${this.apiUrl}/${cfdi.id}`;
    return this.http
      .put<ComprobanteFiscal>(url, cfdi)
      .pipe(catchError((error: any) => throwError(error)));
  }

  list(filtro: any = {}): Observable<ComprobanteFiscal[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    return this.http
      .get<ComprobanteFiscal[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  mostrarXml(comprobanteFiscal: ComprobanteFiscal): Observable<any> {
    const url = `${this.apiUrl}/xml/${comprobanteFiscal.id}`;
    const headers = new HttpHeaders().set('Content-type', 'text/xml');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob'
    });
  }

  mostrarXml2(cfdiId: string): Observable<any> {
    const url = `${this.apiUrl}/xml/${cfdiId}`;
    const headers = new HttpHeaders().set('Content-type', 'text/xml');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob'
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

  importar(periodo: Periodo): Observable<ComprobanteFiscal[]> {
    const url = `${this.apiUrl}/importarFacturasDeImportacion`;
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http.post<ComprobanteFiscal[]>(url, {}, { params: params });
  }
}
