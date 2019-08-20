import {
  throwError as observableThrowError,
  Observable,
  fromEvent
} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from 'app/utils/config.service';
import { Marca } from '../../models/marca';

@Injectable()
export class MarcasService {
  private _apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    // this.apiUrl = configService.buildApiUrl('marcas');
  }

  list(filtro = {}): Observable<Marca[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });

    return this.http
      .get<Marca[]>(this.apiUrl, { params: params })
      .pipe(catchError(error => observableThrowError(error)));
  }

  get(id: string): Observable<Marca> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Marca>(url);
  }

  save(marca: Marca): Observable<Marca> {
    return this.http
      .post<Marca>(this.apiUrl, marca)
      .pipe(catchError(error => observableThrowError(error)));
  }

  update(marca: Marca): Observable<Marca> {
    const url = `${this.apiUrl}/${marca.id}`;
    return this.http
      .put<Marca>(url, marca)
      .pipe(catchError(error => observableThrowError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  get apiUrl() {
    if (!this._apiUrl) {
      this._apiUrl = this.config.buildApiUrl('marcas');
    }
    return this._apiUrl;
  }
}
