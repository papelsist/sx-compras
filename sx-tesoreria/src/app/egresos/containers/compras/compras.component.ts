import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Requisicion, RequisicionesFilter } from '../../models';

@Component({
  selector: 'sx-compras',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
    <mat-card >
      <sx-search-title title="Requisiciones de compras" (search)="search = $event">
        <sx-requisiciones-filter-btn [filter]="filter$ | async" class="options"
          (change)="onFilter($event)"></sx-requisiciones-filter-btn>
        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
      </sx-search-title>
      <mat-divider></mat-divider>
      <div class="table-panel">
        <sx-requisiciones-table [comprobantes]="requisiciones$ | async" [filter]="search"
              (print)="onPrint($event)"
              (select)="onEdit($event)"
              (edit)="onEdit($event)">
        </sx-requisiciones-table>
      </div>
      <mat-card-footer>
        <sx-requisiciones-filter-label [filter]="filter$ | async"></sx-requisiciones-filter-label>
      </mat-card-footer>
    </mat-card>
  </ng-template>
  `,
  styles: [
    `
      .table-panel {
        min-height: 400px;
      }
      .table-det-panel {
        min-height: 200px;
      }
    `
  ]
})
export class ComprasComponent implements OnInit {
  requisiciones$: Observable<Requisicion[]>;
  loading$: Observable<boolean>;
  filter$: Observable<RequisicionesFilter>;
  search = '';

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.requisiciones$ = this.store.pipe(select(fromStore.getCompras));
    this.loading$ = this.store.pipe(select(fromStore.getComprasLoading));
    this.filter$ = this.store.pipe(select(fromStore.getComprasFilter));
  }

  onSelect(event: Requisicion[]) {}

  onSearch(event: string) {}

  onFilter(filter: RequisicionesFilter) {
    this.store.dispatch(new fromStore.SetComprasFilter({ filter }));
  }

  onEdit(event: Requisicion) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['egresos/compras', event.id] })
    );
  }

  onPrint(event: Requisicion) {}

  reload() {
    this.store.dispatch(new fromStore.LoadCompras());
  }
}
