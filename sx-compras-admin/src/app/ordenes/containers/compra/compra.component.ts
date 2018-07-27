import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/compra.actions';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Compra } from '../../models/compra';

import { TdDialogService } from '@covalent/core';

import { ProveedorProducto } from '../../../proveedores/models/proveedorProducto';

@Component({
  selector: 'sx-compra',
  template: `
    <div>
      <sx-compra-form [compra]="compra$ | async" [productos]="productos$ | async"
        (save)="onSave($event)"
        (delete)="onDelete($event)">
      </sx-compra-form>
    </div>
  `
})
export class CompraComponent implements OnInit, OnDestroy {
  compra$: Observable<Compra>;
  productos$: Observable<ProveedorProducto[]>;
  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
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
    this.store.dispatch(new fromActions.AddCompra(event));
  }

  onDelete(event: Compra) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar compra',
        message: 'Folio: ' + event.folio,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromActions.DeleteCompra(event));
        }
      });
  }
}
