import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Periodo } from 'app/_core/models/periodo';
import { MatDialog } from '@angular/material';

import {
  FacturistaCargo,
  FacturistaDeEmbarque
} from 'app/control-de-embarques/model';
import { CargoFormComponent } from 'app/control-de-embarques/components';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-cargos',
  template: `
  <mat-card >
    <sx-search-title title="Otros cargos  " (search)="onSearch($event)">
      <button mat-menu-item color="primary" (click)="reload(periodo)" class="actions" *ngIf="periodo$ | async as periodo">
        <mat-icon>refresh</mat-icon>
        <span>Refrescar</span>
      </button>

    </sx-search-title>
    <mat-divider></mat-divider>
    <div class="table-panel">
      <sx-cargos-table #table
        [cargos]="cargos$ | async"
        [filter]="search$ | async"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)">
      </sx-cargos-table>

    </div>
  </mat-card>
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
    <a mat-fab matTooltip="Nuevo cargo" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      (click)="onCreate() ">
    <mat-icon>add</mat-icon>
    </a>

  </ng-template>
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
export class CargosComponent implements OnInit {
  cargos$: Observable<FacturistaCargo[]>;
  loading$: Observable<boolean>;
  periodo$: Observable<Periodo>;
  search$: Observable<string>;
  facturistas$: Observable<FacturistaDeEmbarque[]>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.cargos$ = this.store.pipe(select(fromStore.getAllCargos));

    this.loading$ = this.store.pipe(select(fromStore.getEnvioComisionLoading));
    this.search$ = this.store.pipe(select(fromStore.getCargosSearch));
    this.facturistas$ = this.store.pipe(select(fromStore.getAllFacturistas));

    this.periodo$ = this.store.pipe(
      select(fromStore.getCargosPeriodo),
      tap(periodo => {
        this.reload(periodo);
      })
    );
  }

  onSearch(event: string) {
    this.store.dispatch(new fromStore.SetCargosSearchTerm({ term: event }));
  }

  onFilter(event: Periodo) {
    this.store.dispatch(
      new fromStore.SetCargosFilter({ filter: { periodo: event } })
    );
  }

  reload(event: Periodo) {
    this.store.dispatch(
      new fromStore.LoadCargos({ filter: { periodo: event } })
    );
  }

  onCreate() {
    this.dialog
      .open(CargoFormComponent, { data: {}, width: '700px' })
      .afterClosed()
      .subscribe((cargo: FacturistaCargo) => {
        if (cargo) {
          this.store.dispatch(new fromStore.CreateCargo({ cargo }));
        }
      });
  }

  onEdit(event: FacturistaCargo) {
    this.dialog
      .open(CargoFormComponent, {
        data: { cargo: event },
        width: '700px'
      })
      .afterClosed()
      .subscribe((changes: Partial<FacturistaCargo>) => {
        if (changes) {
          const update = { id: event.id, changes };
          this.store.dispatch(new fromStore.UpdateCargo({ update }));
        }
      });
  }

  onDelete(event: FacturistaCargo) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar cargo',
        message: 'Prestampo: ' + event.id,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.DeleteCargo({ cargo: event }));
        }
      });
  }
}
