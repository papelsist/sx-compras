import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import * as _ from 'lodash';

import { AnalisisDeTransformacionDet } from '../model';
import { Update } from '@ngrx/entity';

@Injectable({ providedIn: 'root' })
export class AnalisisDeTrsDetService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('cxp/analisisDeTransformacion');
  }

  list(analisisId: number): Observable<AnalisisDeTransformacionDet[]> {
    const url = `${this.apiUrl}/${analisisId}/partidas`;
    return this.http
      .get<AnalisisDeTransformacionDet[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(
    analisisId: number,
    analisis: Partial<AnalisisDeTransformacionDet>
  ): Observable<AnalisisDeTransformacionDet> {
    const url = `${this.apiUrl}/${analisisId}/partidas`;
    return this.http
      .post<AnalisisDeTransformacionDet>(url, analisis)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(
    analisisId: number,
    analisis: Update<AnalisisDeTransformacionDet>
  ): Observable<AnalisisDeTransformacionDet> {
    const url = `${this.apiUrl}/${analisisId}/partidas/${analisis.id}`;
    return this.http
      .put<AnalisisDeTransformacionDet>(url, analisis.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(analisisId: number, id: number) {
    const url = `${this.apiUrl}/${analisisId}/analisis/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
