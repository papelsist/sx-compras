import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params
} from '@angular/router';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';
import * as fromApplication from './application.reducre';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
  parentParams?: Params;
}

export interface State {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  application: fromApplication.State;
}

export const reducers: ActionReducerMap<State> = {
  routerReducer: fromRouter.routerReducer,
  application: fromApplication.reducer
};

export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('routerReducer');

export const getApplicationState = createSelector(
  (state: State) => state.application
);
export const getSucursal = createSelector(
  getApplicationState,
  fromApplication.getSucursal
);
export const getGlobalLoading = createSelector(
  getApplicationState,
  fromApplication.getGlobalLoading
);

export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;
    let parentParams;
    if (state.parent) {
      parentParams = state.parent.params;
    }

    return { url, queryParams, params, parentParams };
  }
}
