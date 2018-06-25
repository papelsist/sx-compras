import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, delay } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { ConfigService } from '../../utils/config.service';
import { Authenticate } from '../models/authenticate';
import { AuthSession, readFromStore } from '../models/authSession';

@Injectable()
export class AuthService {
  private _session: AuthSession;
  constructor(private http: HttpClient, private config: ConfigService) {}

  login(authenticate: Authenticate): Observable<any> {
    const url = this.config.buildApiUrl('login');
    return this.http
      .post<any>(url, authenticate) // .pipe(delay(3000));
      .pipe(catchError((error: any) => throwError(error)));
  }

  getToken() {
    if (this.session) {
      return this.session.access_token;
    }
    return null;
  }

  get session() {
    if (!this._session) {
      this._session = readFromStore();
    }
    return this._session;
  }
}
