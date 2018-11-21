import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/pago-morralla.actions';
import { PagoDeMorralla } from '../../models';
import { PeriodoFilter } from 'app/models';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-pago-morrallas',
  template: `
    <mat-card flex>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Pagos de morralla" (search)="search = $event">
        <sx-periodo-filter-btn [filter]="filter$ | async" class="options" (change)="onFilterChange($event)"></sx-periodo-filter-btn>

        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent"[routerLink]="['create']" class="actions">
          <mat-icon>add</mat-icon> Nuevo
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>
      <sx-pago-morrallas-table [pagos]="pagos$ | async"
          (delete)="onDelete($event)"
          (select)="onSelect($event)"
          [filter]="search">
        </sx-pago-morrallas-table>
      <mat-card-footer>
        <sx-periodo-filter-label [filter]="filter$ | async"></sx-periodo-filter-label>
      </mat-card-footer>
    </ng-template>
    </mat-card>

    <a mat-fab matTooltip="Nuvo pago"
      matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3" [routerLink]="['create']">
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
export class PagoMorrallasComponent implements OnInit {
  pagos$: Observable<PagoDeMorralla[]>;
  search = '';
  filter$: Observable<PeriodoFilter>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(fromStore.getPagoDeMorrallasLoading)
    );
    this.pagos$ = this.store.pipe(select(fromStore.getAllPagoDeMorrallas));
    this.filter$ = this.store.pipe(select(fromStore.getPagoDeMorrallasFilter));
  }

  onSelect(event: PagoDeMorralla) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['egresos/pagoMorralla', event.id] })
    );
  }

  onFilterChange(filter: PeriodoFilter) {
    this.store.dispatch(new fromStore.SetPagoDeMorrallasFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadPagoDeMorrallas());
  }

  onDelete(event: PagoDeMorralla) {
    this.dialogService
      .openConfirm({
        title: `Eliminación del pago de morralla`,
        message: `Folio: ${event.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeletePagoDeMorralla({ pago: event })
          );
        }
      });
  }
}
