import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from 'app/utils/config.service';
import { Linea } from '../../models/linea';

@Injectable()
export class LineasService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('lineas');
  }

  list(filtro: any = {}): Observable<Linea[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });
    return this.http
      .get<Linea[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => Observable.throw(error)));
  }

  get(id: string): Observable<Linea> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Linea>(url);
  }

  save(linea: Linea) {
    return this.http.post(this.apiUrl, linea);
  }

  update(linea: Linea): Observable<Linea> {
    return this.http.put<Linea>(this.apiUrl, linea);
  }

  delete(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.delete(this.apiUrl, { params: params });
  }
}
