import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class AlcanceSimpleService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('existencias');
  }

  crossTab(meses: number = 2) {
    const url = `${this.apiUrl}/alcanceSimpleCrossTab`;
    const params = new HttpParams().set('meses', meses.toString());
    return this.http
      .get<any[]>(url, {params})
      .pipe(catchError((error: any) => throwError(error)));
  }
}
