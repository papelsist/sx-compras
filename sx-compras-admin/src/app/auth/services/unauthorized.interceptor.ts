import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { SESSION_KEY } from '../models/authSession';

/**
 * HTTP 401 Interceptor to redirect to Login (NOT JET USED)
 *
 */
@Injectable()
export class UnautorizedInterceptor implements HttpInterceptor {
  private authService: AuthService;
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((response: any) => {
        if (response instanceof HttpErrorResponse && response.status === 401) {
          // 401 Not autorized error redirect to
          console.log('HTTP 401 Unauthorized', response);
          // localStorage.removeItem(SESSION_KEY);
          // this.router.navigateByUrl('/login');
        }
        return throwError(response);
      })
    );
  }
}
