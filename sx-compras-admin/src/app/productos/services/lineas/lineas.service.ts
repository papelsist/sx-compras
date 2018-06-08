import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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
      .pipe(catchError((error: any) => observableThrowError(error)));
  }

  get(id: string): Observable<Linea> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Linea>(url);
  }

  save(linea: Linea): Observable<Linea> {
    return this.http
      .post<Linea>(this.apiUrl, linea)
      .pipe(catchError(error => observableThrowError(error)));
  }

  update(linea: Linea): Observable<Linea> {
    const url = `${this.apiUrl}/${linea.id}`;
    return this.http.put<Linea>(url, linea);
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError(error => observableThrowError(error)));
  }
}
