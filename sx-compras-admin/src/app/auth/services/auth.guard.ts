import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../store';
import * as fromAuth from '../store/actions/auth.actions';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromStore.AuthState>) {}

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getSession),
      map(session => {
        if (session == null) {
          this.store.dispatch(new fromAuth.Logout());
          return false;
        }
        return true;
      }),
      take(1)
    );
  }
}
