import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { ConfigService } from '../../utils/config.service';
import { Sucursal } from '../../models';
import { Compra } from '../models/compra';

@Injectable()
export class OrdenesService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('compras');
  }

  list(filtro): Observable<Compra[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
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
