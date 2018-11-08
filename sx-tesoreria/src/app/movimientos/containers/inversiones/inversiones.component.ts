import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/inversion.actions';

import { Observable } from 'rxjs';

import { Inversion, TraspasosFilter } from '../../models';
import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';

import { TdDialogService } from '@covalent/core';
import { InversionFormComponent } from 'app/movimientos/components';

@Component({
  selector: 'sx-inversiones',
  template: `
    <mat-card flex>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Inversiones entre cuentas" (search)="search = $event">
        <!--
        <sx-traspasos-filter-btn class="options" [filter]="filter$ | async" (change)="onFilterChange($event)"></sx-traspasos-filter-btn>
        -->
        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent"[routerLink]="['create']" class="actions">
          <mat-icon>add</mat-icon> Nuevo cobro
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>

      <sx-traspasos-table [traspasos]="inversiones | async"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (select)="onSelect($event)"
        [filter]="search"
        [selected]="selected">
      </sx-traspasos-table>

      <sx-traspaso-detail [traspaso]="selected" *ngIf="selected"></sx-traspaso-detail>

      <mat-card-footer>
      <!--
        <sx-traspasos-filter-label [filter]="filter$ | async"></sx-traspasos-filter-label>
      -->
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
    this.dialog
      .open(InversionFormComponent, {
        data: {},
        width: '750px'
      })
      .afterClosed()
      .subscribe((inversion: Inversion) => {
        if (inversion) {
          this.store.dispatch(new fromActions.CreateInversion({ inversion }));
        }
      });
  }

  onEdit(event: Inversion) {
    /*
    this.dialog
      .open(InversionFormComponent, { data: { cobro: event }, width: '750px' })
      .afterClosed()
      .subscribe((changes: Partial<Inversion>) => {
        if (changes) {
          this.store.dispatch(
            new fromActions.UpdateInversion({ cobro: { id: event.id, changes } })
          );
        }
      });
      */
  }

  onDelete(event: Inversion) {
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
}
