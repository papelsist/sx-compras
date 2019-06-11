import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, filter, take, switchMap, catchError, map } from 'rxjs/operators';

import * as fromStore from '../store';
import * as fromActions from '../store/actions/cheque-devuelto.actions';
import { ChequeDevuelto } from '../models';
import { ChequeDevueltoService } from '../services';

@Injectable()
export class ChequesDevueltoExistsGuard implements CanActivate {
  constructor(
    private service: ChequeDevueltoService,
    private store: Store<fromStore.State>
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.chequeId;
    return this.hasEntityInApi(id);
  }

  hasEntityInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(cheque => new fromStore.UpsertChequeDevuelto({ cheque })),
      tap(action => this.store.dispatch(action)),
      map(cheque => !!cheque),
      catchError(() => {
        console.log('Could not load cheque devuelto: ', id);
        return of(false);
      })
    );
  }
}
