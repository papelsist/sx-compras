import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromProveedores from './proveedores.reducer';

export interface ProveedoresState {
  proveedores: fromProveedores.ProveedorState;
}

export const reducers: ActionReducerMap<ProveedoresState> = {
  proveedores: fromProveedores.reducer
};

export const getProveedoresState = createFeatureSelector<ProveedoresState>(
  'proveedores'
);
