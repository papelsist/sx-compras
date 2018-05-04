import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from 'app/utils/config.service';
import { Marca } from '../../models/marca';

@Injectable()
export class MarcasService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('marcas');
  }

  list(filtro = {}): Observable<Marca[]> {
    let params = new HttpParams();
    _.forIn(filtro, (value, key) => {
      params = params.set(key, value);
    });

    return this.http
      .get<Marca[]>(this.apiUrl, { params: params })
      .pipe(catchError(error => Observable.throw(error)));
  }

  get(id: string): Observable<Marca> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Marca>(url);
  }

  save(marca: Marca) {
    return this.http.post(this.apiUrl, marca);
  }

  update(marca: Marca): Observable<Marca> {
    return this.http.put<Marca>(this.apiUrl, marca);
  }

  delete(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.delete(this.apiUrl, { params: params });
  }
}
