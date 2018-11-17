import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/inversion.actions';

import { Observable } from 'rxjs';

import { Inversion, TraspasosFilter } from '../../models';
import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';

import { TdDialogService } from '@covalent/core';
import {
  InversionFormComponent,
  InversionRetornoFormComponent
} from 'app/movimientos/components';

@Component({
  selector: 'sx-inversiones',
  template: `
    <mat-card flex>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Inversiones " (search)="search = $event">
        <sx-periodo-filter-btn [filter]="filter$ | async" class="options" (change)="onFilterChange($event)"></sx-periodo-filter-btn>
        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent"[routerLink]="['create']" class="actions">
          <mat-icon>add</mat-icon> Nuevo cobro
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>

      <sx-inversiones-table [inversiones]="inversiones | async"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (select)="onSelect($event)"
        (retorno)="onRetorno($event)"
        [filter]="search"
        [selected]="selected">
      </sx-inversiones-table>

      <sx-traspaso-detail [traspaso]="selected" *ngIf="selected"></sx-traspaso-detail>

      <mat-card-footer>
        <sx-periodo-filter-label [filter]="filter$ | async"></sx-periodo-filter-label>
      </mat-card-footer>
    </ng-template>
    </mat-card>

    <a mat-fab matTooltip="Alta de traspaso" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
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
export class InversionesComponent implements OnInit {
  inversiones: Observable<Inversion[]>;
  search = '';
  filter$: Observable<TraspasosFilter>;
  loading$: Observable<boolean>;
  selected: Inversion;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getInversionesLoading));
    this.inversiones = this.store.pipe(select(fromStore.getAllInversiones));
    this.filter$ = this.store.pipe(select(fromStore.getInversionesFilter));
  }

  onSelect(event: Inversion) {
    this.selected = event;
  }

  onFilterChange(filter: TraspasosFilter) {
    this.store.dispatch(new fromStore.SetInversionesFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadInversiones());
  }

  onCreate() {
    this.selected = null;
    this.dialog
      .open(InversionFormComponent, {
        data: {},
        width: '650px'
      })
      .afterClosed()
      .subscribe((inversion: Inversion) => {
        if (inversion) {
          this.store.dispatch(new fromActions.CreateInversion({ inversion }));
        }
      });
  }

  onEdit(event: Inversion) {}

  onDelete(event: Inversion) {
    this.selected = null;
    this.dialogService
      .openConfirm({
        title: `Eliminación de inversión`,
        message: `Folio: ${event.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeleteInversion({ inversion: event })
          );
        }
      });
  }

  onRetorno(event: Inversion) {
    this.selected = null;
    this.dialog
      .open(InversionRetornoFormComponent, {
        data: { inversion: event },
        width: '700px'
      })
      .afterClosed()
      .subscribe(changes => {
        if (changes) {
          this.store.dispatch(
            new fromActions.RetornoInversion({
              update: { id: event.id, changes }
            })
          );
        }
      });
  }
}
