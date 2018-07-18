import { Component, OnInit, Input } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions';

import { Observable, Subject } from 'rxjs';

import { Proveedor } from '../../models/proveedor';
import { ProveedorProducto } from '../../models/proveedorProducto';

@Component({
  selector: 'sx-proveedor-productos',
  template: `
    <div>
      <mat-card>
        <sx-search-title title="Productos" (search)="onSearch($event)"></sx-search-title>
        <mat-divider></mat-divider>
        <sx-proveedor-productos-table
          [productos]="productos$ | async"
          [search]="search$ | async"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
          (select)="onSelect($event)">
        </sx-proveedor-productos-table>
      </mat-card>
      <a mat-fab (click)="onAgregar(proveedor)" *ngIf="proveedor$ | async as proveedor"
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
  constructor(private store: Store<fromStore.ProveedoresState>) {}

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
    console.log('Delete: ', event);
  }

  onSelect(event: ProveedorProducto[]) {
    console.log('Selection: ', event);
  }

  onAgregar(proveedor) {
    this.store.dispatch(new fromStore.SelectProductosToAdd(proveedor.id));
  }
}
