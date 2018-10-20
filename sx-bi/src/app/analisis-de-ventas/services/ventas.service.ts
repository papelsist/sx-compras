import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

@Injectable()
export class VentasService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('bi');
  }

  list(command: {}): Observable<any[]> {
    let params = new HttpParams();
    _.forIn(command, (value, key) => {
      params = params.set(key, value);
    });
    return this.http
      .get<any[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
