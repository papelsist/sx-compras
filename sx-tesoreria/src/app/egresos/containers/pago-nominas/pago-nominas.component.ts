import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/pago-nomina.actions';
import { PagoDeNomina } from '../../models';
import { PeriodoFilter } from 'app/models';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import {
  PagoNominaImportarDialogComponent,
  PagoDeNominaDialogComponent
} from 'app/egresos/components';

@Component({
  selector: 'sx-pago-nominas',
  template: `
    <mat-card flex>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Pagos de nómina" (search)="search = $event">
        <sx-periodo-filter-btn [filter]="filter$ | async" class="options" (change)="onFilterChange($event)"></sx-periodo-filter-btn>

        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent"[routerLink]="['create']" class="actions">
          <mat-icon>add</mat-icon> Importar
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>
      <sx-pagos-nomina-table [pagos]="pagos$ | async"
          (delete)="onDelete($event)"
          (select)="onSelect($event)"
          [filter]="search">
        </sx-pagos-nomina-table>
      <mat-card-footer>
        <sx-periodo-filter-label [filter]="filter$ | async"></sx-periodo-filter-label>
      </mat-card-footer>
    </ng-template>
    </mat-card>

    <a mat-fab matTooltip="Importar pagos"
      matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
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
export class PagoNominasComponent implements OnInit {
  pagos$: Observable<PagoDeNomina[]>;
  search = '';
  filter$: Observable<PeriodoFilter>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getPagoDeNominasLoading));
    this.pagos$ = this.store.pipe(select(fromStore.getAllPagoDeNominas));
    this.filter$ = this.store.pipe(select(fromStore.getPagoDeNominasFilter));
  }

  onSelect(event: PagoDeNomina) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['egresos/pagoNominas', event.id] })
    );
  }

  onFilterChange(filter: PeriodoFilter) {
    this.store.dispatch(new fromStore.SetPagoDeNominasFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadPagoDeNominas());
  }

  onCreate() {
    this.dialog
      .open(PagoNominaImportarDialogComponent, {
        data: {},
        width: '450px'
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          this.store.dispatch(
            new fromActions.ImportarPagosDeNomina({ pago: command })
          );
        }
      });
  }

  onDelete(event: PagoDeNomina) {
    this.dialogService
      .openConfirm({
        title: `Eliminación del pago de nómina`,
        message: `Folio: ${event.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeletePagoDeNomina({ pago: event })
          );
        }
      });
  }
}
