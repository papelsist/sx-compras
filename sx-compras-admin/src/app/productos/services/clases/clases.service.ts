import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { ConfigService } from 'app/utils/config.service';
import { Clase } from '../../models/clase';

@Injectable()
export class ClasesService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('clases');
  }

  list(): Observable<Clase[]> {
    return this.http
      .get<Clase[]>(this.apiUrl)
      .pipe(catchError((error: any) => Observable.throw(error)));
  }
}
