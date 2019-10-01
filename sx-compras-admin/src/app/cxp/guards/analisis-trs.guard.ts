import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';

import * as fromStore from '../store';
import * as fromActions from '../store/actions/analisis-de-transformacion.actions';
import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class AnalisisTrsGuard implements CanActivate {
  constructor(private store: Store<fromStore.CxpState>) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(): Observable<boolean> {
    return this.store
      .select(fromStore.selectAnalisisDeTransformacionLoaded)
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.store.dispatch(
              new fromActions.LoadAnalisisDeTransformaciones({
                periodo: Periodo.fromNow(120)
              })
            );
          }
        }),
        filter(loaded => loaded), // Waiting for loaded
        take(1) // End the stream
      );
  }
}
