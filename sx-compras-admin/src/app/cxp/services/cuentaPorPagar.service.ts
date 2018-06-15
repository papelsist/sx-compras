import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';
import { CuentaPorPagar } from '../model/cuentaPorPagar';

@Injectable()
export class CuentaPorPagarService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cuentaPorPagar');
  }

  list(filtro: any = {}): Observable<CuentaPorPagar[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    console.log('Params: ', filtro);
    return this.http
      .get<CuentaPorPagar[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  pendientesDeAnalizar(proveedorId: string): Observable<CuentaPorPagar[]> {
    const url = `${this.apiUrl}/pendientesDeAnalisis/${proveedorId}`;
    return this.http
      .get<CuentaPorPagar[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
