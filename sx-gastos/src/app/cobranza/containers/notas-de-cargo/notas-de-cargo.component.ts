import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  CarteraFilter,
  Cartera,
  NotaDeCargo,
  readFromLocalStorage,
  saveInLocalStorage
} from '../../models';

import { MatDialog } from '@angular/material';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sx-notas-de-cargo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notas-de-cargo.component.html',
  styles: [
    `
      .mat-card {
        width: calc(100% - 15px);
        height: calc(100% - 10px);
      }
    `
  ]
})
export class NotasDeCargoComponent implements OnInit, OnDestroy {
  notas$: Observable<NotaDeCargo[]>;
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
      this.storageKey = data.storageKey || 'sx.cxc.notas-cargo';
      this.loadFilter();
      this.reload(this.cartera, this.filter);
    });
    this.loading$ = this.store.pipe(select(fromStore.getNotasDeCargoLoading));
    this.notas$ = this.store.pipe(select(fromStore.getAllNotasDeCargo));
    this.search$ = this.store.pipe(select(fromStore.getNotasDeCargoSearchTerm));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  loadFilter() {
    this.filter = readFromLocalStorage(`${this.storageKey}.filter`);
  }

  onSelect(event: NotaDeCargo) {
    console.log('Select: ', event);
    this.store.dispatch(
      new fromRoot.Go({ path: ['cobranza/notas-de-cargo', event.id] })
    );
  }

  onFilterChange(filter: CarteraFilter) {
    this.filter = filter;
    saveInLocalStorage(`${this.storageKey}.filter`, filter);
  }

  reload(cartera: Cartera, filter?: CarteraFilter) {
    this.store.dispatch(
      new fromStore.LoadNotasDeCargo({ cartera: cartera, filter })
    );
  }
}
