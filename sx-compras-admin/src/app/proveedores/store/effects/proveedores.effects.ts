import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as proveedorActions from '../actions/proveedores.actions';
import * as fromServices from '../../services';
import * as fromRoot from 'app/store';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ProveedoresEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.ProveedoresService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadEntites$ = this.actions$.ofType(proveedorActions.LOAD_PROVEEDORES).pipe(
    switchMap(() => {
      return this.service
        .list()
        .pipe(
          map(
            proveedores =>
              new proveedorActions.LoadProveedoresSuccess(proveedores)
          ),
          catchError(error =>
            of(new proveedorActions.LoadProveedoresFail(error))
          )
        );
    })
  );

  @Effect()
  updateProducto$ = this.actions$
    .ofType(proveedorActions.UPDATE_PROVEEDOR_ACTION)
    .pipe(
      map((action: proveedorActions.UpdateProveedor) => action.payload),
      switchMap(proveedor => {
        return this.service
          .update(proveedor)
          .pipe(
            map(res => new proveedorActions.UpdateProveedorSuccess(res)),
            catchError(error =>
              of(new proveedorActions.UpdateProveedorFail(error))
            )
          );
      })
    );

  @Effect()
  updateSuccess$ = this.actions$.pipe(
    ofType<proveedorActions.UpdateProveedorSuccess>(
      proveedorActions.UPDATE_PROVEEDOR_ACTION_SUCCESS
    ),
    map(action => action.payload),
    tap(proveedores =>
      this.snackBar.open(
        `Proveedor ${proveedores.nombre} actualizado `,
        'Cerrar',
        {
          duration: 2000
        }
      )
    ),
    map(
      proveedores =>
        new fromRoot.Go({ path: ['cxp/proveedores', proveedores.id] })
    )
  );

  /*
  @Effect()
  createProducto$ = this.actions$.ofType(productoActions.CREATE_PRODUCTO).pipe(
    map((action: productoActions.CreateProducto) => action.payload),
    switchMap(newProduct => {
      return this.productosService
        .save(newProduct)
        .pipe(
          map(producto => new productoActions.CreateProductoSuccess(producto)),
          catchError(error => of(new productoActions.CreateProductoFail(error)))
        );
    })
  );

  @Effect()
  createProductoSuccess$ = this.actions$
    .ofType(productoActions.CREATE_PRODUCTO_SUCCESS)
    .pipe(
      map((action: productoActions.CreateProductoSuccess) => action.payload),
      map(producto => {
        return new fromRoot.Go({
          path: ['productos/productos', producto.id]
        });
      })
    );



  @Effect()
  removeProducto$ = this.actions$.ofType(productoActions.REMOVE_PRODUCTO).pipe(
    map((action: productoActions.RemoveProducto) => action.payload),
    switchMap(producto => {
      return this.productosService
        .delete(producto.id)
        .pipe(
          map(() => new productoActions.RemoveProductoSuccess(producto)),
          catchError(error => of(new productoActions.RemoveProductoFail(error)))
        );
    })
  );

  @Effect()
  handleProductoSuccess$ = this.actions$
    .ofType(
      productoActions.UPDATE_PRODUCTO_SUCCESS,
      productoActions.REMOVE_PRODUCTO_SUCCESS
    )
    .pipe(
      map(pizza => {
        return new fromRoot.Go({
          path: ['/productos/productos']
        });
      })
    );

  @Effect()
  searchProductos$ = this.actions$
    .ofType(productoActions.SEARCH_PRODUCTOS)
    .pipe(
      map((action: productoActions.SearchProductos) => action.payload),
      switchMap(criteria => {
        return this.productosService
          .list(criteria)
          .pipe(
            map(res => new productoActions.SearchProductosSuccess(res)),
            catchError(error =>
              of(new productoActions.SearchProductosFail(error))
            )
          );
      })
    );

    */
}
