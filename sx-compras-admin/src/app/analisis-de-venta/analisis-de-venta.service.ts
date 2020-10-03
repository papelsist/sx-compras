import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Periodo } from 'app/_core/models/periodo';
import { ConfigService } from 'app/utils/config.service';

@Injectable({ providedIn: 'root' })
export class AnalisisDeVentaService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('bi');
  }

  fetchVentas(periodo: Periodo) {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    const url = `${this.apiUrl}/analisisDeVenta`;
    return this.http
      .get<any[]>(url, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
