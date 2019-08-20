import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { ReciboService } from '../services/recibo.service';

@Injectable({ providedIn: 'root' })
export class ReciboExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: ReciboService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.reciboId;
    return this.hasEntityInApi(id);
  }

  hasEntityInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(recibo => new fromActions.UpsertRecibo({ recibo })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.recibo),
      catchError(e => {
        console.log('Error:_ ', e);
        return of(false);
      })
    );
  }
}
