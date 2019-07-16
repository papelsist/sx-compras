import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions/analisis.actions';

import { Analisis } from '../model/analisis';
import { AnalisisService } from '../services';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class AnalisisExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.CxpState>,
    private service: AnalisisService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.analisisId;
    return this.hasAnalisisInApi(id);
    /*
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.analisisId;
        return this.hasAnalisis(id);
      })
    );
    */
  }

  /**
   * `hasAnalisis` composes `hasAnalaisisInStore` and `hasAnalisisInApi`. It first checks
   * if the analisis is in store, and if not it then checks if it is in the
   * API.
   */
  hasAnalisis(id: string): Observable<boolean> {
    return this.hasAnalisisInStore(id).pipe(
      switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasAnalisisInApi(id);
      })
    );
  }

  hasAnalisisInStore(id: string): Observable<boolean> {
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

  hasAnalisisInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(analisis => new fromActions.LoadAnalisis(analisis)),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload),
      catchError(() => {
        console.error('Could not fetch analisis from API');
        return of(false);
      })
    );
  }
}
