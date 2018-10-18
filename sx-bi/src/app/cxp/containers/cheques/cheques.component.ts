import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/cheque.actions';

import { Observable, Subject } from 'rxjs';

import { Cheque, ChequesFilter } from '../../model';
import { MatDialog } from '@angular/material';
import { FechaDialogComponent } from 'app/_shared/components';

import * as moment from 'moment';

@Component({
  selector: 'sx-cheques',
  template: `
    <mat-card>
      <sx-search-title title="Cheques registrados" (search)="onSearch($event)">
        <sx-cheques-filter-btn class="options" [filter]="filter$ | async" (change)="onFilterChange($event)"></sx-cheques-filter-btn>
      </sx-search-title>
      <mat-divider></mat-divider>
        <sx-cheques-table [cheques]="cheques$ | async" [filter]="search$ | async"
          (liberar)="onLiberar($event)" (entregar)="onEntregar($event)">
        </sx-cheques-table>
      <mat-card-footer>
        <sx-cheques-filter-label [filter]="filter$ | async"></sx-cheques-filter-label>
      </mat-card-footer>
    </mat-card>
  `
})
export class ChequesComponent implements OnInit {
  cheques$: Observable<Cheque[]>;
  search$ = new Subject<string>();
  filter$: Observable<ChequesFilter>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cheques$ = this.store.pipe(select(fromStore.getAllCheques));
    this.filter$ = this.store.pipe(select(fromStore.getChequesFilter));
  }

  onSelect() {}

  onFilterChange(filter: ChequesFilter) {
    this.store.dispatch(new fromStore.SetChequesFilter({ filter }));
  }

  onSearch(event: string) {
    this.search$.next(event);
  }

  onLiberar(event: Cheque) {
    this.dialog
      .open(FechaDialogComponent, {
        data: { fecha: event.impresion, title: 'Fecha de liberación' }
      })
      .afterClosed()
      .subscribe((res: string) => {
        if (res) {
          const cheque = {
            id: event.id,
            changes: { liberado: res }
          };
          this.store.dispatch(new fromStore.UpdateCheque({ cheque }));
        }
      });
  }

  onEntregar(event: Cheque) {
    this.dialog
      .open(FechaDialogComponent, { data: { fecha: event.impresion } })
      .afterClosed()
      .subscribe((res: string) => {
        if (res) {
          const cheque = {
            id: event.id,
            changes: { entregado: res }
          };
          this.store.dispatch(new fromStore.UpdateCheque({ cheque }));
        }
      });
  }
}
