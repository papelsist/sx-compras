import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { Periodo } from 'app/_core/models/periodo';
import { ConfigService } from 'app/utils/config.service';
import { RequisicionDeMaterial } from 'app/requisiciones/models';

@Injectable({ providedIn: 'root' })
export class RequisicionDeMaterialService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('requisicionDeMaterial');
  }

  list(periodo: Periodo): Observable<RequisicionDeMaterial[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<RequisicionDeMaterial[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<RequisicionDeMaterial> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<RequisicionDeMaterial>(url);
  }

  save(
    requisicion: Partial<RequisicionDeMaterial>
  ): Observable<RequisicionDeMaterial> {
    return this.http.post<RequisicionDeMaterial>(this.apiUrl, requisicion);
  }

  update(
    requisicion: RequisicionDeMaterial
  ): Observable<RequisicionDeMaterial> {
    const url = `${this.apiUrl}/${requisicion.id}`;
    return this.http
      .put<RequisicionDeMaterial>(url, requisicion)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
