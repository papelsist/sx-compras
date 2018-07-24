import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/listasDePrecios.actions';

import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { Proveedor } from '../../models/proveedor';
import { ProveedorProducto } from '../../models/proveedorProducto';
import {
  ListaDePreciosProveedor,
  buildLista
} from '../../models/listaDePreciosProveedor';

import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-proveedor-lista-create',
  template: `
    <div>
      <sx-proveedor-lista-form [listaDePrecios]="listaNueva$ | async" (save)="onSave($event)"
        (cancel)="onCancel()">
        </sx-proveedor-lista-form>
    </div>
  `
})
export class ProveedorListaCreateComponent implements OnInit {
  productos$: Observable<ProveedorProducto[]>;
  listaNueva$: Observable<Partial<ListaDePreciosProveedor>>;

  constructor(private store: Store<fromStore.ProveedoresState>) {}

  ngOnInit() {
    this.productos$ = this.store.pipe(
      select(fromStore.getAltaDeListaProductos)
    );
    this.buildListaNueva();
  }

  buildListaNueva() {
    this.listaNueva$ = combineLatest(
      this.store.select(fromStore.getSelectedProveedor),
      this.store.select(fromStore.getCreateListMoneda),
      this.store.pipe(select(fromStore.getAltaDeListaProductos)),
      (proveedor, moneda, productos) => {
        return buildLista(proveedor, moneda, productos);
      }
    );
  }

  onSave(event: ListaDePreciosProveedor) {
    this.store.dispatch(new fromActions.AddListaDePreciosProveedor(event));
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Back());
  }
}
