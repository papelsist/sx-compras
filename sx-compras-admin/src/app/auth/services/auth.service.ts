import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, delay } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { ConfigService } from '../../utils/config.service';
import { Authenticate } from '../models/authenticate';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  login(authenticate: Authenticate): Observable<any> {
    const url = this.config.buildApiUrl('login');
    return this.http
      .post<any>(url, authenticate) // .pipe(delay(3000));
      .pipe(catchError((error: any) => throwError(error)));
  }
}
