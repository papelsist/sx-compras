import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromStore from '../reducers/application.reducer';
import * as fromApplication from '../actions/application.actions';

import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, defer, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel
} from '@angular/router';
import {
  ROUTER_NAVIGATION,
  RouterNavigationAction,
  RouterCancelAction,
  ROUTER_CANCEL
} from '@ngrx/router-store';
import { TdLoadingService } from '@covalent/core';

@Injectable()
export class ApplicationsEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<fromStore.State>,
    private loadingService: TdLoadingService
  ) {
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          console.log('Nav start:-------');
          this.store.dispatch(
            new fromApplication.SetGlobalLoading({ loading: true })
          );
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationError:
        case event instanceof NavigationCancel: {
          console.log('Cancel navigation.....');
          this.store.dispatch(
            new fromApplication.SetGlobalLoading({ loading: false })
          );
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  @Effect({ dispatch: false })
  loading$ = this.actions$.pipe(
    ofType<fromApplication.SetGlobalLoading>(
      fromApplication.ApplicationActionTypes.SetGlobalLoading
    ),
    tap(action => {
      if (action.payload.loading) {
        this.loadingService.register();
      } else {
        this.loadingService.resolve();
      }
    })
  );

  @Effect({ dispatch: false })
  init$: Observable<any> = defer(() => of(null)).pipe(
    tap(() => console.log('Effect inicial de la applicacion: init$'))
  );
}
