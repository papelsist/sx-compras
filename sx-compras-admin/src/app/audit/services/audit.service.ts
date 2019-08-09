import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { Update } from '@ngrx/entity';
import { Periodo } from 'app/_core/models/periodo';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('audit');
  }

  list(periodo: Periodo = Periodo.fromNow(2)): Observable<any[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<any[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
