import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/compra.actions';

import { Observable } from 'rxjs';

import { Compra } from '../../models/compra';
import { ProveedorProducto } from '../../../proveedores/models/proveedorProducto';
import { CompraUiService } from './compra-ui.service';

@Component({
  selector: 'sx-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.scss'],
  providers: [CompraUiService]
})
export class CompraComponent implements OnInit, OnDestroy {
  compra$: Observable<Compra>;
  productos$: Observable<ProveedorProducto[]>;
  loading$: Observable<boolean>;
  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getComprasLoading));
    this.compra$ = this.store.pipe(select(fromStore.getSelectedCompra));
    this.productos$ = this.store.pipe(
      select(fromStore.getAllProductosDisponibles)
    );
    this.store.dispatch(new fromStore.LoadProductosDisponibles());
  }

  ngOnDestroy() {
    this.store.dispatch(new fromStore.ClearProductosDisponibles());
  }

  onSave(event: Compra) {
    if (!event.id) {
      this.store.dispatch(new fromActions.AddCompra(event));
    } else {
      this.store.dispatch(new fromActions.UpdateCompra(event));
    }
  }

  onDelete(event: Compra) {
    this.store.dispatch(new fromActions.DeleteCompra(event));
  }
  onCerrar(event: Compra) {
    console.log('Cerrar: ', event);
  }

  onDepurar(event: Compra) {
    this.store.dispatch(new fromActions.DepurarCompra(event));
  }

  actualizarPrecios(compra: Partial<Compra>) {
    this.store.dispatch(
      new fromActions.ActualizarPrecios({ compraId: compra.id })
    );
  }

  getPrintUrl(event: Compra) {
    return `compras/print/${event.id}`;
  }
}
