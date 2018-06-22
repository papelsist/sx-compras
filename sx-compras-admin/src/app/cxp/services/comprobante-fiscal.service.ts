import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';
import { ComprobanteFiscal } from '../model/comprobanteFiscal';

import * as _ from 'lodash';
import { CuentaPorPagar } from '../model/cuentaPorPagar';

@Injectable()
export class ComprobanteFiscalService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('comprobanteFiscal');
  }

  list(filtro: any = {}): Observable<ComprobanteFiscal[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    console.log('Params: ', filtro);
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
