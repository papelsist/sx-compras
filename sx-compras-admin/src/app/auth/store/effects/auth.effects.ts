import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';

import { map, tap, switchMap, catchError } from 'rxjs/operators';
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
}
