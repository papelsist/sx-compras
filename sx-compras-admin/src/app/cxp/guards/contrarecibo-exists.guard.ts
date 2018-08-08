import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions/contrarecibos.actions';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';

import { Contrarecibo } from '../model';
import { ContrareciboService } from '../services';

@Injectable()
export class ContrareciboExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.CxpState>,
    private service: ContrareciboService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.reciboId;
        return this.hasReciboInApi(id);
      })
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getContrarecibosLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadContrarecibos());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }

  hasReciboInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(recibo => new fromActions.UpsertContrarecibo({ recibo })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.recibo),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['cxp/contrarecibos'] }));
        return of(false);
      })
    );
  }
}
