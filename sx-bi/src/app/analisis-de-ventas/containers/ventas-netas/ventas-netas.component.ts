import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';
import { VentaFilter } from 'app/analisis-de-ventas/models/venta-filter';
import { VentaNeta } from 'app/analisis-de-ventas/models/venta-neta';
import { SetSelectedVenta } from '../../store';

@Component({
  selector: 'sx-ventas-netas',
  template: `
    <mat-card >
      <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
        <div layout layout-align="start center"  class="pad-left-sm pad-right-sm">
          <span class="push-left-sm" layout>
            <span class="mat-title">
              <span>Ventas</span>
              <ng-container *ngIf="filter$ | async as filter">
                <span class="pad-left">Por: </span>
                <span class="pad-left">{{filter.clasificacion}}</span>
              </ng-container>
            </span>
          </span>
          <span flex></span>
          <td-search-box class="push-right-sm" placeholder="Filtrar" flex (searchDebounce)="onSearch($event)">
          </td-search-box>
          <span>
            <button mat-icon-button [matMenuTriggerFor]="toolbarMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #toolbarMenu="matMenu">
              <button mat-menu-item (click)="bajaEnVentas()">
                <mat-icon matListAvatar>picture_as_pdf</mat-icon>
                Baja en Ventas
              </button>
            </mat-menu>
          </span>
        </div>
      </ng-template>
      <mat-divider></mat-divider>
      <ng-container *ngIf="filter$ | async as filter">
        <sx-ventas-acumuladas-table [ventas]="ventas$ | async" [filter]="search" (select)="drill($event)"></sx-ventas-acumuladas-table>
      </ng-container>
    </mat-card>
  `
})
export class VentasNetasComponent implements OnInit {
  ventas$: Observable<any[]>;
  loading$: Observable<boolean>;
  filter$: Observable<VentaFilter>;
  search: string;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getVentaNetaLoading));
    this.ventas$ = this.store.pipe(select(fromStore.getAllVentaNeta));
    this.filter$ = this.store.pipe(select(fromStore.getVentaFilter));
  }

  onSearch(event: string) {
    this.search = event;
  }

  drill(event: VentaNeta) {
    this.store.dispatch(new SetSelectedVenta({ selected: event }));
    this.store.dispatch(
      new fromRoot.Go({
        path: ['analisisDeVentas', event.origenId]
      })
    );
  }

  bajaEnVentas() {}
}
