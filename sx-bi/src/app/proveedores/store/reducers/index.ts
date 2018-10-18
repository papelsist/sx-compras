import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromProveedores from './proveedores.reducer';
import * as fromProductos from './proveedorProductos.reducer';
import * as fromListas from './listasDePrecios.reducer';

export interface ProveedoresState {
  proveedores: fromProveedores.ProveedorState;
  productos: fromProductos.ProveedorProductosState;
  listas: fromListas.ListasDePrecioState;
}

export const reducers: ActionReducerMap<ProveedoresState> = {
  proveedores: fromProveedores.reducer,
  productos: fromProductos.reducer,
  listas: fromListas.reducer
};

export const getProveedoresState = createFeatureSelector<ProveedoresState>(
  'proveedores'
);
