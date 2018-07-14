import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromProveedores from './proveedores.reducer';
import * as fromProductos from './proveedorProductos.reducer';

export interface ProveedoresState {
  proveedores: fromProveedores.ProveedorState;
  productos: fromProductos.ProveedorProductosState;
}

export const reducers: ActionReducerMap<ProveedoresState> = {
  proveedores: fromProveedores.reducer,
  productos: fromProductos.reducer
};

export const getProveedoresState = createFeatureSelector<ProveedoresState>(
  'proveedores'
);
