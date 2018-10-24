import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable, combineLatest, Subscription } from 'rxjs';
import { VentasService } from 'app/analisis-de-ventas/services';
import { VentaNeta } from 'app/analisis-de-ventas/models/venta-neta';
import { VentaFilter } from 'app/analisis-de-ventas/models/venta-filter';

@Component({
  selector: 'sx-ventas-por-producto',
  template: `
    <mat-card>
      <div layout layout-align="start center"  class="pad-left-sm pad-right-sm">
        <button mat-icon-button (click)="back()"><mat-icon>arrow_back</mat-icon></button>
        <span class="push-left-sm">
          <span class="mat-title">Ventas por producto</span>
        </span>
        <span flex></span>
        <td-search-box class="push-right-sm" placeholder="Filtrar" flex (searchDebounce)="onSearch($event)">
        </td-search-box>
      </div>
      <mat-divider></mat-divider>
      <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
        <sx-ventas-por-producto-table [ventas]="ventas$ | async" (select)="drill($event)" [filter]="search"></sx-ventas-por-producto-table>
      </ng-template>
    </mat-card>
    <mat-card>
      <pre>
        <sx-operaciones-table [ventas]="operaciones"></sx-operaciones-table>
      </pre>
    </mat-card>
  `
})
export class VentaPorProductoComponent implements OnInit, OnDestroy {
  ventas$: Observable<any[]>;
  loading$: Observable<boolean>;
  search: string;
  subscription: Subscription;
  operaciones: any[] = [];

  row: VentaNeta;
  filtro: VentaFilter;

  constructor(
    private store: Store<fromStore.State>,
    private service: VentasService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(fromStore.getVentaPorProductoLoading)
    );
    this.ventas$ = this.store.pipe(select(fromStore.getAllVentaPorProducto));
    const row$ = this.store.pipe(select(fromStore.getSelectedVenta));
    const filter$ = this.store.pipe(select(fromStore.getVentaFilter));

    this.subscription = combineLatest(row$, filter$, (row, filter) => {
      this.row = row;
      this.filtro = filter;
      return {
        row,
        filter
      };
    }).subscribe((res: any) => {
      this.store.dispatch(
        new fromStore.LoadVentaPorProducto({
          origenId: res.row.origenId,
          filter: res.filter
        })
      );
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.store.dispatch(new fromStore.SetSelectedVenta({ selected: null }));
  }

  onSearch(event: string) {
    this.search = event;
  }

  drill(event) {
    this.service
      .movimientoCosteadoDet(this.filtro, this.row.origenId, event.clave)
      .subscribe(res => (this.operaciones = res));
  }

  back() {
    this.store.dispatch(new fromRoot.Back());
  }
}
