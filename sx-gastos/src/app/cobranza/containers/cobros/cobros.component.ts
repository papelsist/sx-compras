import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  Cobro,
  CarteraFilter,
  Cartera,
  saveInLocalStorage,
  readFromLocalStorage
} from '../../models';

import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';

import { TdDialogService } from '@covalent/core';
import { FechaDialogComponent } from 'app/_shared/components';
import { ActivatedRoute } from '@angular/router';
import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-cobros',
  template: `
    <mat-card>
      <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Cobros de: ({{cartera.descripcion}})" (search)="search = $event">

        <sx-cartera-filter-btn
          *ngIf="filter"
          class="options"
          [filter]="filter"
          (change)="onFilterChange($event)">
        </sx-cartera-filter-btn>

        <button mat-menu-item class="actions" (click)="reload(cartera, filter)"><mat-icon>refresh</mat-icon> Recargar</button>
      </sx-search-title>
      <mat-divider></mat-divider>

      <sx-cobros-table
        [cobros]="cobros$ | async"
        [filter]="search$ | async"
        (select)="onSelect($event)"
        >
      </sx-cobros-table>

      <mat-card-footer>
        <sx-cartera-filter-label [filter]="filter" *ngIf="filter"></sx-cartera-filter-label>
      </mat-card-footer>

      </ng-template>
    </mat-card>
  `,
  styles: [
    `
      .mat-card {
        width: calc(100% - 15px);
        height: calc(100% - 10px);
      }
    `
  ]
})
export class CobrosComponent implements OnInit, OnDestroy {
  cobros$: Observable<Cobro[]>;
  search$: Observable<string>;
  filter: CarteraFilter;
  cartera: Cartera;
  destroy$ = new Subject<boolean>();
  loading$: Observable<boolean>;

  storageKey: string;

  constructor(
    private store: Store<fromStore.State>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.cartera = data.cartera;
      this.storageKey = data.storageKey || 'sx.cxc.cobros';
      this.loadFilter();
      this.reload(this.cartera, this.filter);
    });
    this.loading$ = this.store.pipe(select(fromStore.getCobrosLoading));
    this.cobros$ = this.store.pipe(select(fromStore.getAllCobros));
    this.search$ = this.store.pipe(select(fromStore.getCobrosSearchTerm));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  loadFilter() {
    this.filter = readFromLocalStorage(`${this.storageKey}.filter`);
  }

  onSelect(event: Cobro) {
    console.log('Select: ', event);
    this.store.dispatch(
      // new fromRoot.Go({ path: [event.id], extras: { relativeTo: this.route } })
      new fromRoot.Go({ path: ['cobranza/cobros', event.id] })
    );
  }

  onFilterChange(filter: CarteraFilter) {
    this.filter = filter;
    saveInLocalStorage(`${this.storageKey}.filter`, filter);
  }

  reload(cartera: Cartera, filter?: CarteraFilter) {
    this.store.dispatch(new fromStore.LoadCobros({ cartera: cartera, filter }));
  }
}
