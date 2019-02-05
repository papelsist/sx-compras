import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Requisicion, RequisicionesFilter } from '../../model';

@Component({
  selector: 'sx-cxp-requisiciones',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
    <mat-card >
      <sx-search-title title="Requisiciones de gastos" (search)="search = $event">
        <sx-requisiciones-filter-btn [filter]="filter$ | async" class="options"
          (change)="onFilter($event)"></sx-requisiciones-filter-btn>
        <button mat-button color="primary" (click)="reload()" class="actions"><mat-icon>refresh</mat-icon> Refrescar</button>
      </sx-search-title>
      <mat-divider></mat-divider>
      <div class="table-panel">
        <sx-requisiciones-table [comprobantes]="requisiciones$ | async" [filter]="search"
              (print)="onPrint($event)"
              (select)="onSelect($event)"
              (edit)="onEdit($event)">
        </sx-requisiciones-table>
      </div>
      <mat-card-footer>
        <sx-requisiciones-filter-label [filter]="filter$ | async"></sx-requisiciones-filter-label>
      </mat-card-footer>
    </mat-card>
    <a mat-fab matTooltip="Alta de requisición" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      [routerLink]="['create']">
    <mat-icon>add</mat-icon>
    </a>
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
export class RequisicionesComponent implements OnInit {
  requisiciones$: Observable<Requisicion[]>;
  loading$: Observable<boolean>;
  filter$: Observable<RequisicionesFilter>;
  search = '';

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.requisiciones$ = this.store.pipe(
      select(fromStore.getAllRequisiciones)
    );
    this.loading$ = this.store.pipe(select(fromStore.getRequisicionLoading));
    this.filter$ = this.store.pipe(select(fromStore.getRequisicionesFilter));
  }

  onSelect(event: Requisicion[]) {}

  onSearch(event: string) {}

  onFilter(filter: RequisicionesFilter) {
    this.store.dispatch(new fromStore.SetRequisicionesFilter({ filter }));
  }

  onEdit(event: Requisicion) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['cxp/requisiciones', event.id] })
    );
  }

  reload() {
    this.store.dispatch(new fromStore.LoadRequisiciones());
  }

  onPrint(event: Requisicion) {}
}
