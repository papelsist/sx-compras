import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/devolucion-cliente.actions';
import { DevolucionCliente } from '../../models';
import { PeriodoFilter } from 'app/models';

import { Observable } from 'rxjs';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-devoluciones',
  template: `
    <mat-card flex>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Devoluciones a clientes" (search)="search = $event">
        <sx-periodo-filter-btn [filter]="filter$ | async" class="options" (change)="onFilterChange($event)"></sx-periodo-filter-btn>

        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent"[routerLink]="['create']" class="actions">
          <mat-icon>add</mat-icon> Nuevo
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>

      <sx-devoluciones-table [devoluciones]="devoluciones$ | async"
          (select)="onSelect($event)"
          [filter]="search">
      </sx-devoluciones-table>

      <mat-card-footer>
        <sx-periodo-filter-label [filter]="filter$ | async"></sx-periodo-filter-label>
      </mat-card-footer>
    </ng-template>
    </mat-card>

    <a mat-fab matTooltip="Alta de devolución"
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
export class DevolucionesComponent implements OnInit {
  devoluciones$: Observable<DevolucionCliente[]>;
  search = '';
  filter$: Observable<PeriodoFilter>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(fromStore.getDevolucionClienteLoading)
    );
    this.devoluciones$ = this.store.pipe(
      select(fromStore.getAllDevolucionCliente)
    );
    this.filter$ = this.store.pipe(
      select(fromStore.getDevolucionClienteFilter)
    );
  }

  onSelect(event: DevolucionCliente) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['egresos/devoluciones', event.id] })
    );
  }

  onFilterChange(filter: PeriodoFilter) {
    this.store.dispatch(new fromStore.SetDevolucionClientesFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadDevoluciones());
  }

  onDelete(event: DevolucionCliente) {
    this.dialogService
      .openConfirm({
        title: `Eliminar devolución de cliente`,
        message: `Folio: ${event.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeleteDevolucionCliente({ devolucion: event })
          );
        }
      });
  }
}
