import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { ConfigService } from '../../utils/config.service';
import { Sucursal } from '../../models';
import { Compra } from '../models/compra';
import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class ComprasService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('compras');
  }

  list(periodo: Periodo): Observable<Compra[]> {
    const { fechaInicial, fechaFinal } = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', fechaInicial)
      .set('fechaFinal', fechaFinal);
    return this.http.get<Compra[]>(this.apiUrl, { params: params });
  }

  get(id: string): Observable<Compra> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Compra>(url);
  }

  save(compra: Compra) {
    return this.http.post(this.apiUrl, compra);
  }

  depurar(compra: Compra) {
    const url = this.configService.buildApiUrl('compras/depurar/' + compra.id);
    return this.http.put(url, {});
  }

  delete(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.delete(this.apiUrl, { params: params });
  }

  print(compra: Compra) {
    const endpoint = `compras/print/${compra.id}`;
    const url = this.configService.buildApiUrl(endpoint);
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob'
    });
  }
}
