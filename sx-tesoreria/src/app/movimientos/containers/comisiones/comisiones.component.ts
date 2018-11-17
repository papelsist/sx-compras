import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/comision.actions';
import { Comision } from '../../models';
import { PeriodoFilter } from 'app/models';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { ComisionFormComponent } from 'app/movimientos/components';

@Component({
  selector: 'sx-comisiones',
  template: `
    <mat-card flex>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Comisiones bancarias" (search)="search = $event">
        <sx-periodo-filter-btn [filter]="filter$ | async" class="options" (change)="onFilterChange($event)"></sx-periodo-filter-btn>

        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent"[routerLink]="['create']" class="actions">
          <mat-icon>add</mat-icon> Nuevo cobro
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>
      <sx-comisiones-table [comisiones]="comisiones$ | async"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
          (select)="onSelect($event)"
          [filter]="search"
          [selected]="selected">
        </sx-comisiones-table>
      <sx-traspaso-detail [traspaso]="selected" *ngIf="selected"></sx-traspaso-detail>


      <mat-card-footer>
        <sx-periodo-filter-label [filter]="filter$ | async"></sx-periodo-filter-label>
      </mat-card-footer>
    </ng-template>
    </mat-card>

    <a mat-fab matTooltip="Alta de comision"
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
export class ComisionesComponent implements OnInit {
  comisiones$: Observable<Comision[]>;
  search = '';
  filter$: Observable<PeriodoFilter>;
  loading$: Observable<boolean>;
  selected: Comision;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getComisionesLoading));
    this.comisiones$ = this.store.pipe(select(fromStore.getAllComisiones));
    this.filter$ = this.store.pipe(select(fromStore.getComisionesFilter));
  }

  onSelect(event: Comision) {
    this.selected = event;
  }

  onFilterChange(filter: PeriodoFilter) {
    this.store.dispatch(new fromStore.SetComisionesFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadComisiones());
  }

  onCreate() {
    this.selected = null;
    this.dialog
      .open(ComisionFormComponent, {
        data: {},
        width: '650px'
      })
      .afterClosed()
      .subscribe((comision: Comision) => {
        if (comision) {
          this.store.dispatch(new fromActions.CreateComision({ comision }));
        }
      });
  }

  onEdit(event: Comision) {}

  onDelete(event: Comision) {
    this.selected = null;
    this.dialogService
      .openConfirm({
        title: `Eliminación de comisión bancaria`,
        message: `Folio: ${event.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeleteComision({ comision: event })
          );
        }
      });
  }
}
