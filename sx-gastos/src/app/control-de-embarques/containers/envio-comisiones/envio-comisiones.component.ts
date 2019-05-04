import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { EnvioComision, EnviosFilter } from '../../model';
import { Periodo } from 'app/_core/models/periodo';
import { MatDialog } from '@angular/material';
import {
  EnvioComisionFormComponent,
  EnvioComisionesTableComponent
} from 'app/control-de-embarques/components';

@Component({
  selector: 'sx-envio-comisiones',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
    <mat-card >
      <sx-search-title title="Comisiones de embarques " (search)="search = $event">
        <sx-envios-filter-btn [filter]="filter$ | async" class="options"
          (change)="onFilter($event)">
        </sx-envios-filter-btn>
        <button mat-menu-item color="primary" (click)="reload()" class="actions">
          <mat-icon>refresh</mat-icon>
          <span>Refrescar</span>
        </button>
        <button mat-menu-item  *ngIf="filter$ | async as filter" class="actions"
          (click)="generarComisiones(filter)" >
          <mat-icon>settings</mat-icon>
          Generar
        </button>
        <button mat-menu-item   class="actions" [disabled]="currentSelection.length === 0"
          (click)="modificar()" >
          <mat-icon>edit</mat-icon>
          Modificar
        </button>

      </sx-search-title>
      <mat-divider></mat-divider>
      <div class="table-panel">

        <sx-envio-comisiones-table #table
          [comisiones]="envioComisiones$ | async"
          [filter]="search"
          (print)="onPrint($event)"
          (select)="onSelect($event)">
        </sx-envio-comisiones-table>

      </div>
      <!--
      <mat-card-footer>
        <sx-envios-filter-label [filter]="filter$ | async"></sx-envios-filter-label>
      </mat-card-footer>
      -->
    </mat-card>

  </ng-template>
  `,
  styles: [
    `
      .table-panel {
        min-height: 400px;
      }
      .table-det-panel {
        min-height: 200px;
      }
    `
  ]
})
export class EnvioComisionesComponent implements OnInit {
  envioComisiones$: Observable<EnvioComision[]>;
  loading$: Observable<boolean>;
  filter$: Observable<EnviosFilter>;
  search = '';

  currentSelection: EnvioComision[] = [];

  @ViewChild(EnvioComisionesTableComponent)
  table: EnvioComisionesTableComponent;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.envioComisiones$ = this.store.pipe(
      select(fromStore.getAllEnvioComision)
    );
    this.loading$ = this.store.pipe(select(fromStore.getEnvioComisionLoading));
    this.filter$ = this.store.pipe(select(fromStore.getEnvioComisionFilter));
  }

  onSelect(event: EnvioComision[]) {
    this.currentSelection = event;
  }

  onSearch(event: string) {}

  onFilter(filter: EnviosFilter) {
    this.store.dispatch(new fromStore.SetEnvioComisionesFilter({ filter }));
  }

  onPrint(event: EnvioComision) {}

  reload() {
    this.store.dispatch(new fromStore.LoadEnvioComisiones());
  }

  generarComisiones(filter: EnviosFilter) {
    const periodo = new Periodo(filter.fechaInicial, filter.fechaFinal);
    this.store.dispatch(new fromStore.GenerarComisiones({ periodo }));
  }

  modificar() {
    this.dialog
      .open(EnvioComisionFormComponent, {
        data: {
          comisionBase: this.currentSelection[0],
          registros: this.currentSelection.length
        },
        width: '650px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const command = {
            ...res,
            registros: this.currentSelection.map(item => item.id)
          };
          this.store.dispatch(
            new fromStore.UpdateManyComisiones({ data: command })
          );
          this.table.clearSelection();
        }
      });
  }
}
