import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromProductos from '../reducers/proveedorProductos.reducer';
import { ProveedorProducto } from '../../models/proveedorProducto';

import * as _ from 'lodash';

export const getProveedorProductosState = createSelector(
  fromFeature.getProveedoresState,
  (state: fromFeature.ProveedoresState) => state.productos
);

export const getProveedorProductosEntities = createSelector(
  getProveedorProductosState,
  fromProductos.getProveedorProductosEntites
);

export const getAllProveedorProductos = createSelector(
  getProveedorProductosEntities,
  entities => {
    return Object.keys(entities).map(id => entities[id]);
  }
);

/**
 * Selector que con ayuda del router (RouterState ngrx-router)
 * regresa la moneda adecuada deacuerdo a la ruta Ej:proveedor/:id/create?moneda=MXN
 */
export const getCreateListMoneda = createSelector(
  fromRoot.getRouterState,
  routerState => {
    const mon = routerState.state.queryParams.moneda;
    return mon;
  }
);

/**
 * Selector para obtener con los productos por proveedor disponibles para
 * el alta de la lista de precios. Estos son todos los productos por proveedor vigentes
 * filtrados por la moneda definida el la ruta Ej: proveedor/:id/create?moneda=MXN par
 * produtos en moneda nacional
 */
export const getAltaDeListaProductos = createSelector(
  getAllProveedorProductos,
  getCreateListMoneda,
  (productos, mon) => {
    return productos.filter(item => item.moneda === mon && !item.suspendido);
  }
);

export const getProductosDisponibles = createSelector(
  getAllProveedorProductos,
  fromRoot.getRouterState,
  (productos, routerState) => {
    // console.log('routerState: ', routerState.state);
    const mon = routerState.state.queryParams.moneda;
    return productos.filter(item => item.moneda === mon);
  }
);

export const getProveedorProductosLoaded = createSelector(
  getProveedorProductosState,
  fromProductos.getProveedorProductosLoaded
);

export const getProveedorProductosLoading = createSelector(
  getProveedorProductosState,
  fromProductos.getProveedorProductosLoading
);

export const getSelectedProveedorProductos = createSelector(
  getProveedorProductosState,
  fromRoot.getRouterState,
  (entities, router): ProveedorProducto => {
    return router.state && entities[router.state.params.proveedorId];
  }
);

export const getProveedorProductosFilter = createSelector(
  getProveedorProductosState,
  fromProductos.getProveedorProductosSearchFilter
);
