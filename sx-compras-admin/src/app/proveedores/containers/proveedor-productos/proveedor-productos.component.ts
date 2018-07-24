import { Component, OnInit, Input } from '@angular/core';

import { Store, select } from '@ngrx/store';

import * as fromStore from '../../store';

import { Observable, Subject } from 'rxjs';

import { Proveedor } from '../../models/proveedor';
import { ProveedorProducto } from '../../models/proveedorProducto';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-proveedor-productos',
  template: `
    <div *ngIf="proveedor$ | async as proveedor">
      <mat-card >
        <sx-search-title title="Productos"
          (search)="onSearch($event)">
          <button mat-menu-item class="actions" (click)="onAgregar(proveedor, 'MXN')">
            <mat-icon>add</mat-icon> Agregar (MXN)
          </button>
          <button mat-menu-item class="actions" (click)="onAgregar(proveedor, 'USD')">
            <mat-icon>add</mat-icon> Agregar (USD)
          </button>
        </sx-search-title>
        <mat-divider></mat-divider>
        <sx-proveedor-productos-table
          [productos]="productos$ | async"
          [search]="search$ | async"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
          (select)="onSelect($event)">
        </sx-proveedor-productos-table>
      </mat-card>
      <a mat-fab (click)="onAgregar(proveedor, 'MXN')"
        matTooltip="Agregar producto"
        matTooltipPosition="before" color="accent"
        class="mat-fab-position-bottom-right ">
      <mat-icon>add</mat-icon>
      </a>
    </div>
  `
})
export class ProveedoProductosComponent implements OnInit {
  proveedor$: Observable<Proveedor>;
  productos$: Observable<ProveedorProducto[]>;
  search$ = new Subject();
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

  onSearch(event: string) {
    this.search$.next(event.toLowerCase());
  }

  onEdit(event: ProveedorProducto) {
    this.store.dispatch(new fromStore.EditProveedorProducto(event));
  }

  onDelete(event: ProveedorProducto) {
    this.dialogService
      .openConfirm({
        message: event.descripcion,
        title: 'Quitar producto del proveedor',
        cancelButton: 'Cancelar',
        acceptButton: 'Eliminar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.DeleteProveedorProducto(event));
        }
      });
  }

  onSelect(event: ProveedorProducto[]) {
    console.log('Selection: ', event);
  }

  onAgregar(proveedor, moneda) {
    const params = { proveedorId: proveedor.id, moneda };
    this.store.dispatch(new fromStore.SelectProductosToAdd(params));
  }
}
