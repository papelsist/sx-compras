import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';
import { BancoSat } from 'app/models';

@Injectable()
export class BancoSatService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('tesoreria/bancoSat');
  }

  list(): Observable<BancoSat[]> {
    return this.http
      .get<BancoSat[]>(this.apiUrl)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<BancoSat> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<BancoSat>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(cuenta: {
    id: string;
    changes: Partial<BancoSat>;
  }): Observable<BancoSat> {
    const url = `${this.apiUrl}/${cuenta.id}`;
    return this.http
      .put<BancoSat>(url, cuenta.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
