import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Cobro, CobrosFilter } from '../../models';
import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';

@Component({
  selector: 'sx-cobros',
  template: `
    <mat-card>
      <sx-search-title title="Cobros registrados" (search)="search = $event">
        <!--
          <sx-cobros-filter-btn class="options" [filter]="filter$ | async" (change)="onFilterChange($event)"></sx-cobros-filter-btn>
        -->
        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
      </sx-search-title>
      <mat-divider></mat-divider>
      <!--
        <sx-cobros-table [cobros]="cobros$ | async" [filter]="search"
          (liberar)="onLiberar($event)" (entregar)="onEntregar($event)" (cobrado)="onCobro($event)">
        </sx-cobros-table>
      -->
      <mat-card-footer>
        <!--
        <sx-cobros-filter-label [filter]="filter$ | async"></sx-cobros-filter-label>
        -->
      </mat-card-footer>
    </mat-card>
  `
})
export class CobrosComponent implements OnInit {
  cobros$: Observable<Cobro[]>;
  search = '';
  filter$: Observable<CobrosFilter>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.cobros$ = this.store.pipe(select(fromStore.getAllCobros));
    this.filter$ = this.store.pipe(select(fromStore.getCobrosFilter));
  }

  onSelect() {}

  onFilterChange(filter: CobrosFilter) {
    this.store.dispatch(new fromStore.SetCobrosFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadCobros());
  }
}
