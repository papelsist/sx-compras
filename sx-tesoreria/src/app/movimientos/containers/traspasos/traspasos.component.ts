import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions';

import { Observable } from 'rxjs';

import { Traspaso, TraspasosFilter } from '../../models/traspaso';
import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';
// import { TraspasoFormComponent } from 'app/ingresos/components';
import { TdDialogService } from '@covalent/core';
import { TraspasoFormComponent } from 'app/movimientos/components/traspaso-form/traspaso-form-component';

@Component({
  selector: 'sx-traspasos',
  template: `
    <mat-card flex>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Traspasos entre cuentas" (search)="search = $event">
        <!--
        <sx-traspasos-filter-btn class="options" [filter]="filter$ | async" (change)="onFilterChange($event)"></sx-traspasos-filter-btn>
        -->
        <sx-periodo-filter-btn [filter]="filter$ | async" class="options" (change)="onFilterChange($event)"></sx-periodo-filter-btn>
        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent"[routerLink]="['create']" class="actions">
          <mat-icon>add</mat-icon> Nuevo cobro
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>

      <sx-traspasos-table [traspasos]="traspasos$ | async"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (select)="onSelect($event)"
        [filter]="search"
        [selected]="selected">
      </sx-traspasos-table>

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
export class TraspasosComponent implements OnInit {
  traspasos$: Observable<Traspaso[]>;
  search = '';
  filter$: Observable<TraspasosFilter>;
  loading$: Observable<boolean>;
  selected: Traspaso;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getTraspasosLoading));
    this.traspasos$ = this.store.pipe(select(fromStore.getAllTraspasos));
    this.filter$ = this.store.pipe(select(fromStore.getTraspasosFilter));
  }

  onSelect(event: Traspaso) {
    this.selected = event;
  }

  onFilterChange(filter: TraspasosFilter) {
    this.store.dispatch(new fromStore.SetTraspasosFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadTraspasos());
  }

  onCreate() {
    this.dialog
      .open(TraspasoFormComponent, {
        data: {},
        width: '750px'
      })
      .afterClosed()
      .subscribe((traspaso: Traspaso) => {
        if (traspaso) {
          this.store.dispatch(new fromActions.CreateTraspaso({ traspaso }));
        }
      });
  }

  onEdit(event: Traspaso) {}

  onDelete(event: Traspaso) {
    this.dialogService
      .openConfirm({
        title: `Eliminación de traspaso`,
        message: `Folio: ${event.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeleteTraspaso({ traspaso: event })
          );
        }
      });
  }
}
