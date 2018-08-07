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
          </button >
          <button mat-menu-item class="actions" [disabled]="selected.length === 0"
            (click)="onDelete(selected)">
            <mat-icon>cancel</mat-icon> Quitar
          </button>
        </sx-search-title>
        <mat-divider></mat-divider>
        <sx-proveedor-productos-table
          [productos]="productos$ | async"
          [search]="search$ | async"
          (edit)="onEdit($event)"
          (delete)="onDeleteRow($event)"
          (activar)="onActivarRow($event)"
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
  selected: ProveedorProducto[] = [];
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

  onDeleteRow(event: ProveedorProducto) {
    this.onDelete([event]);
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

  onActivarRow(event: ProveedorProducto) {
    console.log('Acivar producto: ', event);
  }
}
