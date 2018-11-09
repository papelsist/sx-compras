import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/movimientoDeTesoreria.actions';

import { Observable } from 'rxjs';

import { MovimientoDeTesoreria } from '../../models';
import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';

import { TdDialogService } from '@covalent/core';
import { PeriodoFilter } from 'app/models';
import { MovTesFormComponent } from 'app/movimientos/components';

@Component({
  selector: 'sx-movimientos-tes',
  template: `
    <mat-card flex>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Movimientos de tesorería " (search)="search = $event">
        <sx-periodo-filter-btn [filter]="filter$ | async" class="options"></sx-periodo-filter-btn>
        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent"[routerLink]="['create']" class="actions">
          <mat-icon>add</mat-icon> Nuevo
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>

      <sx-mov-tes-table [movimientos]="movimientos | async"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (select)="onSelect($event)"
        [filter]="search"
        [selected]="selected">
      </sx-mov-tes-table>


      <mat-card-footer>
        <sx-periodo-filter-label [filter]="filter$ | async"></sx-periodo-filter-label>
      </mat-card-footer>
    </ng-template>
    </mat-card>

    <a mat-fab matTooltip="Alta" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
    (click)="onCreate()">
  <mat-icon>add</mat-icon>
  </a>

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
export class MovimientosTesComponent implements OnInit {
  movimientos: Observable<MovimientoDeTesoreria[]>;
  search = '';
  filter$: Observable<PeriodoFilter>;
  loading$: Observable<boolean>;
  selected: MovimientoDeTesoreria;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getMovimientosLoading));
    this.movimientos = this.store.pipe(select(fromStore.getAllMovimientos));
    this.filter$ = this.store.pipe(select(fromStore.getMovimientosFilter));
  }

  onSelect(event: MovimientoDeTesoreria) {
    this.selected = event;
  }

  onFilterChange(filter: PeriodoFilter) {
    this.store.dispatch(new fromStore.SetMovimientosFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadMovimientos());
  }

  onCreate() {
    this.dialog
      .open(MovTesFormComponent, {
        data: {},
        width: '650px'
      })
      .afterClosed()
      .subscribe((movimiento: MovimientoDeTesoreria) => {
        if (movimiento) {
          this.store.dispatch(new fromActions.CreateMovimiento({ movimiento }));
        }
      });
  }

  onEdit(event: MovimientoDeTesoreria) {}

  onDelete(event: MovimientoDeTesoreria) {
    this.selected = null;
    this.dialogService
      .openConfirm({
        title: `Eliminación movimiento`,
        message: `Folio: ${event.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeleteMovimiento({ movimiento: event })
          );
        }
      });
  }
}
