import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

@Component({
  selector: 'sx-ventas-por-producto',
  template: `
    <mat-card>
      <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
        <sx-search-title title="Ventas por producto" (search)="onSearch($event)"></sx-search-title>
      </ng-template>
      <mat-divider></mat-divider>

    </mat-card>
  `
})
export class VentaPorProductoComponent implements OnInit {
  ventas$: Observable<any[]>;
  loading$: Observable<boolean>;
  search: string;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(fromStore.getVentaPorProductoLoading)
    );
    this.ventas$ = this.store.pipe(select(fromStore.getAllVentaPorProducto));
  }

  onSearch(event: string) {
    this.search = event;
  }

  drill(event) {}
}
