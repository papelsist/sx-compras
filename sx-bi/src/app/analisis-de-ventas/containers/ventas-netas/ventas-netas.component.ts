import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

@Component({
  selector: 'sx-ventas-netas',
  template: `
    <mat-card>
      <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
        <sx-search-title title="Ventas" (search)="onSearch($event)"></sx-search-title>
      </ng-template>
      <mat-divider></mat-divider>
      <sx-ventas-acumuladas-table [ventas]="ventas$ | async" [filter]="search" (select)="drill($event)"></sx-ventas-acumuladas-table>
    </mat-card>
  `
})
export class VentasNetasComponent implements OnInit {
  ventas$: Observable<any[]>;
  loading$: Observable<boolean>;
  search: string;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getVentaNetaLoading));
    this.ventas$ = this.store.pipe(select(fromStore.getAllVentaNeta));
  }

  onSearch(event: string) {
    this.search = event;
  }

  drill(event) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['analisisDeVentas', event.origenId] })
    );
  }
}
