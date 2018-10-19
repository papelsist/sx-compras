import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/cheque.actions';

import { Observable } from 'rxjs';

import { Cheque, ChequesFilter } from '../../models';
import { MatDialog } from '@angular/material';
import { FechaDialogComponent } from 'app/_shared/components';
import { ReportService } from 'app/reportes/services/report.service';

@Component({
  selector: 'sx-cheques',
  template: `
    <mat-card>
      <sx-search-title title="Cheques registrados" (search)="search = $event">
        <sx-cheques-filter-btn class="options" [filter]="filter$ | async" (change)="onFilterChange($event)"></sx-cheques-filter-btn>
        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <button mat-menu-item class="actions" (click)="chequesPendientes()">
          <mat-icon>picture_as_pdf</mat-icon> Cheques pendientes
        </button>
      </sx-search-title>
      <mat-divider></mat-divider>
        <sx-cheques-table [cheques]="cheques$ | async" [filter]="search"
          (liberar)="onLiberar($event)" (entregar)="onEntregar($event)" (cobrado)="onCobro($event)">
        </sx-cheques-table>
      <mat-card-footer>
        <sx-cheques-filter-label [filter]="filter$ | async"></sx-cheques-filter-label>
      </mat-card-footer>
    </mat-card>
  `
})
export class ChequesComponent implements OnInit {
  cheques$: Observable<Cheque[]>;
  search = '';
  filter$: Observable<ChequesFilter>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.cheques$ = this.store.pipe(select(fromStore.getAllCheques));
    this.filter$ = this.store.pipe(select(fromStore.getChequesFilter));
  }

  onSelect() {}

  onFilterChange(filter: ChequesFilter) {
    this.store.dispatch(new fromStore.SetChequesFilter({ filter }));
  }

  onLiberar(event: Cheque) {}

  onEntregar(event: Cheque) {}

  reload() {
    this.store.dispatch(new fromStore.LoadCheques());
  }

  onCobro(event: Cheque) {
    this.dialog
      .open(FechaDialogComponent, {
        data: { fecha: event.fecha }
      })
      .afterClosed()
      .subscribe((res: Date) => {
        if (res) {
          const cheque = {
            id: event.id,
            changes: { cobrado: res.toISOString() }
          };
          this.store.dispatch(new fromActions.UpdateCheque({ cheque }));
        }
      });
  }

  chequesPendientes() {
    this.reportService.runReport('tesoreria/cheques/chequesPendientes', {});
  }
}
