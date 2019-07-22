import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  tap,
  filter,
  take,
  switchMap,
  catchError,
  map,
  withLatestFrom
} from 'rxjs/operators';

import * as fromStore from '../store';

@Injectable()
export class RequisicionesGuard implements CanActivate {
  constructor(private store: Store<fromStore.CxpState>) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getRequisicionesLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadRequisiciones());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }
}
