import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { tap, map, filter, take, switchMap } from 'rxjs/operators';
import * as fromStore from '../store';
import { Analisis } from '../model/analisis';

@Injectable()
export class AnalisisExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.CxpState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.analisisId;
        return this.hasAnalisis(id);
      })
    );
  }

  hasAnalisis(id: string): Observable<boolean> {
    return this.store
      .select(fromStore.getAnalisisEntities)
      .pipe(
        map((entities: { [key: string]: Analisis }) => !!entities[id]),
        take(1)
      );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getAnalisisLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.Load());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }
}
