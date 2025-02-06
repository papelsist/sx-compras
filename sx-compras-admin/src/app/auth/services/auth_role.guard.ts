import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';


import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(private store: Store<fromStore.AuthState>) {}

  canActivate(): Observable<boolean>  {
    console.log('Evaluando la navegacion con roles...');
    return this.store.pipe(
      select(fromStore.getSession),
      map(session => {
          if (session.roles.find(item => item === 'ROLE_CXP_USER')) {
            return true;
          } else {
            return false;
          }
      }),
      take(1)
    );
  }
}
