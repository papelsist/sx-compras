import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/contrarecibos.actions';

import { Observable, Subject } from 'rxjs';

import { ComprobanteFiscalService } from '../../services';
import { Contrarecibo } from '../../model';
import { ProveedorPeriodoFilter } from 'app/cxp/model/proveedorPeriodoFilter';

@Component({
  selector: 'sx-recibos-cxp',
  template: `
    <mat-card>
      <sx-search-title title="Contrarecibos" (search)="onSearch($event)">
        <sx-proveedor-periodo-filter-btn class="options" (change)="onFilterChange($event)" [filter]="filter$ | async">
        </sx-proveedor-periodo-filter-btn>
      </sx-search-title>
      <mat-divider></mat-divider>
      <div class="recibos-panel">
        <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
          <sx-recibos-table [recibos]="recibos$ | async" [filter]="search$ | async"></sx-recibos-table>
        </ng-template>
      </div>
      <mat-card-footer>
        <sx-proveedor-periodo-filter-label [filter]="filter$ | async"></sx-proveedor-periodo-filter-label>
      </mat-card-footer>
    </mat-card>
    <a mat-fab matTooltip="Alta de contrarecibo" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      [routerLink]="['create']">
    <mat-icon>add</mat-icon>
  `,
  styles: [
    `
      .recibos-panel {
        min-height: 300px;
      }
    `
  ]
})
export class RecibosComponent implements OnInit {
  recibos$: Observable<Contrarecibo[]>;
  search$ = new Subject<string>();
  loading$: Observable<boolean>;
  filter$: Observable<ProveedorPeriodoFilter>;

  constructor(
    private store: Store<fromStore.CxpState>,
    private service: ComprobanteFiscalService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getContrarecibosLoading));
    this.filter$ = this.store.pipe(select(fromStore.getContrarecibosFilter));
    this.recibos$ = this.store.pipe(select(fromStore.getAllContrarecibos));
  }

  onSelect() {}

  onSearch(event: string) {
    this.search$.next(event);
  }

  onFilterChange(filter: ProveedorPeriodoFilter) {
    this.store.dispatch(new fromStore.SetContrarecibosFilter({ filter }));
  }
}
