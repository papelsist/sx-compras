import { Component, OnInit, Input } from '@angular/core';

import { Store, select } from '@ngrx/store';

import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Proveedor } from '../../models/proveedor';
import { ProveedorProducto } from '../../models/proveedorProducto';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-proveedor-productos',
  templateUrl: './proveedor-productos.component.html',
  styleUrls: ['proveedor-productos.component.scss']
})
export class ProveedoProductosComponent implements OnInit {
  proveedor$: Observable<Proveedor>;
  productos$: Observable<ProveedorProducto[]>;
  selected: ProveedorProducto[] = [];

  constructor(
    private store: Store<fromStore.ProveedoresState>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.proveedor$ = this.store.pipe(select(fromStore.getCurrentProveedor));
    this.productos$ = this.store.pipe(
      select(fromStore.getAllProveedorProductos)
    );
  }

  onEdit(event: ProveedorProducto) {
    this.store.dispatch(new fromStore.EditProveedorProducto(event));
  }

  onDelete(event: ProveedorProducto[]) {
    this.dialogService
      .openConfirm({
        message: `${event.length} productos seleccionados`,
        title: 'Eliminar/Suspender producto(s)',
        cancelButton: 'Cancelar',
        acceptButton: 'Eliminar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          event.forEach(item =>
            this.store.dispatch(new fromStore.DeleteProveedorProducto(item))
          );
        }
      });
  }

  onSelect(event: ProveedorProducto[]) {
    this.selected = [...event];
  }

  onAgregar(proveedor, moneda) {
    const params = { proveedorId: proveedor.id, moneda };
    this.store.dispatch(new fromStore.SelectProductosToAdd(params));
  }
}
