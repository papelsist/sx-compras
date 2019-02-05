import { Component, OnInit, Input } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/listasDePrecios.actions';

import { Observable, Subject } from 'rxjs';

import { Proveedor } from '../../models/proveedor';
import { ListaDePreciosProveedor } from '../../models/listaDePreciosProveedor';
import { Moneda } from '../../../models';

@Component({
  selector: 'sx-proveedor-listas',
  template: `
    <div *ngIf="proveedor$ | async as proveedor">
      <mat-card >
        <sx-search-title title="Listas de precios"
          (search)="onSearch($event)">
          <button mat-menu-item class="actions" (click)="onAgregar(proveedor)">
            <mat-icon>add</mat-icon> Agregar ('MXN')
          </button>
          <button mat-menu-item class="actions" (click)="onAgregar(proveedor, 'USD')">
            <mat-icon>add</mat-icon> Agregar ('USD')
          </button>
        </sx-search-title>
        <mat-divider></mat-divider>
        <sx-proveedor-listas-table
          [listas]="listas$ | async"
          [search]="search$ | async"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
          (select)="onSelect($event)">
        </sx-proveedor-listas-table>
      </mat-card>
      <a mat-fab (click)="onAgregar(proveedor)"
        matTooltip="Alta de lista"
        matTooltipPosition="before" color="accent"
        class="mat-fab-position-bottom-right ">
      <mat-icon>add</mat-icon>
      </a>

    </div>
  `
})
export class ProveedorListasComponent implements OnInit {
  proveedor$: Observable<Proveedor>;
  listas$: Observable<ListaDePreciosProveedor[]>;
  search$ = new Subject();
  constructor(private store: Store<fromStore.ProveedoresState>) {}

  ngOnInit() {
    this.listas$ = this.store.pipe(select(fromStore.getAllListas));
    this.proveedor$ = this.store.pipe(select(fromStore.getCurrentProveedor));
  }

  onSearch(event: string) {
    this.search$.next(event.toLowerCase());
  }

  onAgregar(proveedor: Proveedor, moneda: Moneda = Moneda.MXN) {
    this.store.dispatch(
      new fromRoot.Go({
        path: [`proveedores/${proveedor.id}/listas/create`],
        query: { moneda }
      })
    );
  }

  onEdit(event: ListaDePreciosProveedor) {
    this.store.dispatch(
      new fromRoot.Go({
        path: [`proveedores/${event.proveedor.id}/listas/${event.id}`]
      })
    );
  }
  onSelect(event: ListaDePreciosProveedor) {}

  onDelete(event: ListaDePreciosProveedor) {}
}
