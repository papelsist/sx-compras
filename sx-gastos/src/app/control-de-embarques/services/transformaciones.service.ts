import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { Periodo } from 'app/_core/models/periodo';
import { Transformacion } from '../model';
import { Update } from '@ngrx/entity';

@Injectable()
export class TransformacionService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('transformaciones');
  }

  list(
    periodo: Periodo = Periodo.mesActual(),
    registros: number = 50
  ): Observable<Transformacion[]> {
    const params = new HttpParams()
      .set('registros', registros.toString())
      .set('tipo', 'MAQ')
      .set('fechaInicial', periodo.fechaInicial.toISOString())
      .set('fechaFinal', periodo.fechaFinal.toISOString());

    return this.http
      .get<Transformacion[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<Transformacion>): Observable<Transformacion> {
    console.log('Update: ', update);
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Transformacion>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
