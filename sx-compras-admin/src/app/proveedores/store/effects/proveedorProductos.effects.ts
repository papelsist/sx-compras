import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, concatMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as productosActions from '../actions/proveedorProducto.actions';
import * as fromServices from '../../services';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import {
  ProveedorProductoFormComponent,
  ProductosDisponiblesComponent
} from '../../components';

@Injectable()
export class ProveedorProductosEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.ProveedoresState>,
    private service: fromServices.ProveedorProductoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  @Effect()
  loadProveedorProductos$ = this.actions$.pipe(
    ofType<productosActions.LoadProveedorProductos>(
      productosActions.LOAD_PROVEEDOR_PRODUCTOS
    ),
    map(action => action.payload),
    switchMap(proveedorId => {
      return this.service
        .list(proveedorId)
        .pipe(
          map(
            productos =>
              new productosActions.LoadProveedorProductosSuccess(productos)
          ),
          catchError(error =>
            of(new productosActions.LoadProveedorProductosFail(error))
          )
        );
    })
  );

  @Effect()
  updateProveedor$ = this.actions$.pipe(
    ofType<productosActions.UpdateProveedorProducto>(
      productosActions.UPDATE_PROVEEDOR_PRODUCTO_ACTION
    ),
    map(action => action.payload),
    switchMap(proveedor => {
      return this.service
        .update(proveedor)
        .pipe(
          map(res => new productosActions.UpdateProveedorProductoSuccess(res)),
          catchError(error =>
            of(new productosActions.UpdateProveedorProductoFail(error))
          )
        );
    })
  );

  @Effect({ dispatch: false })
  editProveedorProducto = this.actions$.pipe(
    ofType<productosActions.EditProveedorProducto>(
      productosActions.EDIT_PROVEEDOR_PRODUCTO_ACTION
    ),
    map(action => action.payload),
    map(producto => {
      this.dialog
        .open(ProveedorProductoFormComponent, {
          data: { producto: producto },
          width: '650px',
          minHeight: '600px'
        })
        .afterClosed()
        .subscribe(prod => {
          if (prod) {
            const res = { ...producto, ...prod };
            this.store.dispatch(
              new productosActions.UpdateProveedorProducto(res)
            );
          }
        });
    })
  );

  @Effect({ dispatch: false })
  selectProductos = this.actions$.pipe(
    ofType<productosActions.SelectProductosToAdd>(
      productosActions.SELECT_PRODUCTOS_TO_ADD
    ),
    map(action => action.payload),
    map(params => {
      this.service.disponibles(params).subscribe(disponibles => {
        this.dialog
          .open(ProductosDisponiblesComponent, {
            data: { productos: disponibles, moneda: params.moneda },
            width: '850px',
            height: '700'
          })
          .afterClosed()
          .subscribe(productos => {
            if (productos) {
              const target = { ...params, productos };
              this.store.dispatch(
                new productosActions.AddProveedorProductos(target)
              );
            }
          });
      });
    })
  );

  @Effect()
  addProductos = this.actions$.pipe(
    ofType<productosActions.AddProveedorProductos>(
      productosActions.ADD_PROVEEDOR_PRODUCTOS
    ),
    map(action => action.payload),
    switchMap(params => {
      return this.service
        .agregarProductos(params)
        .pipe(
          map(res => new productosActions.AddProveedorProductosSuccess(res)),
          catchError(error =>
            of(new productosActions.AddProveedorProductosFail(error))
          )
        );
    })
  );

  @Effect()
  deleteProducto = this.actions$.pipe(
    ofType<productosActions.DeleteProveedorProducto>(
      productosActions.DELETE_PROVEEDOR_PRODUCTO
    ),
    map(action => action.payload),
    concatMap(provProd => {
      return this.service.delete(provProd).pipe(
        map(res => {
          if (res.suspendido) {
            return new productosActions.UpdateProveedorProductoSuccess(res);
          } else {
            return new productosActions.DeleteProveedorProductoSuccess(res);
          }
        }),
        catchError(error =>
          of(new productosActions.DeleteProveedorProductoFail(error))
        )
      );
    })
  );
}
