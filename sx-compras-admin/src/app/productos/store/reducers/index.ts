import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromProductos from './productos.reducer';
import * as fromLineas from './lineas.reducer';
import * as fromMarcas from './marcas.reducer';
import * as fromClases from './clases.reducer';
import * as fromGrupos from './grupos.reducer';

export interface CatalogosState {
  productos: fromProductos.ProductoState;
  lineas: fromLineas.LineaState;
  marcas: fromMarcas.MarcaState;
  clases: fromClases.ClaseState;
  grupos: fromGrupos.GrupoState;
}

export const reducers: ActionReducerMap<CatalogosState> = {
  productos: fromProductos.reducer,
  lineas: fromLineas.reducer,
  marcas: fromMarcas.reducer,
  clases: fromClases.reducer,
  grupos: fromGrupos.reducer
};

export const getCatalogosState = createFeatureSelector<CatalogosState>(
  'catalogos'
);
