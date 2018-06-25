import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterAction } from '@ngrx/router-store';

import { map, tap, filter, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthActionTypes, AuthActions } from '../actions/auth.actions';
import * as fromActions from '../actions/auth.actions';
import * as fromRoot from 'app/store';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private service: AuthService) {}

  @Effect()
  loginRedirect$ = this.actions$.pipe(
    ofType(AuthActionTypes.LOGIN_REDIRECT),
    tap(() => console.log('Redirect to login page')),
    map(() => new fromRoot.Go({ path: ['/login'] }))
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType<fromActions.Login>(AuthActionTypes.LOGIN),
    map(action => action.payload),
    switchMap(auth => {
      return this.service
        .login(auth)
        .pipe(
          map(userInfo => new fromActions.LoginSuccess(userInfo)),
          catchError(error => of(new fromActions.LoginFail(error)))
        );
    })
  );

  @Effect()
  loginSuccess$ = this.actions$.pipe(
    ofType<fromActions.LoginSuccess>(AuthActionTypes.LOGIN_SUCCESS),
    map(action => action.payload),
    tap(session => {
      session.start = new Date();
      localStorage.setItem('siipapx_session', JSON.stringify(session));
    }),
    map(() => new fromRoot.Go({ path: ['/'] }))
  );

  @Effect()
  logoutRoute$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    map((action: any) => action.payload.routerState.url),
    filter(routerState => routerState.url === '/logout'),
    map(() => new fromActions.Logout())
  );

  @Effect()
  logout$ = this.actions$.pipe(
    ofType<fromActions.Logout>(AuthActionTypes.LOGOUT),
    tap(() => localStorage.removeItem('siipapx_session')),
    map(() => new fromRoot.Go({ path: ['/login'] }))
  );
}
