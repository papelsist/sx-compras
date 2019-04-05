import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

import { FacturistaDeEmbarque } from '../model';


@Injectable({
  providedIn: 'root'
})
export class FacturistaService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('embarques/facturistas');
  }

  list(): Observable<FacturistaDeEmbarque[]> {
    const params = new HttpParams()
      .set('max', '100');
    return this.http
      .get<FacturistaDeEmbarque[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
