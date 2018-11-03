import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Ficha, FichaFilter } from '../../models';
import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';

import * as _ from 'lodash';
import { RelacionFichasComponent } from '../../../reportes/components';
import { FichasGenerarComponent, FichaInfoComponent } from '../../components';
import { FichasService } from '../../services';

@Component({
  selector: 'sx-fichas',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
    <mat-card>
    <div layout layout-align="start center"  class="pad-left-sm pad-right-sm">
      <span class="push-left-sm">
        <span class="mat-title">Fichas registrados</span>
        </span>
        <span layout *ngIf="fichas$ | async as fichas" class="tc-indigo-600 pad">

        <span layout>
          <span class="pad-left">Efectivo: </span>
          <span class="pad-left">{{getTotal(fichas, 'EFECTIVO') | currency}}</span>
        </span>
        <span layout>
          <span class="pad-left">Otros: </span>
          <span class="pad-left">{{getTotal(fichas, 'OTROS_BANCOS') | currency}}</span>
        </span>
        <span layout>
          <span class="pad-left">Mismo: </span>
          <span class="pad-left">{{getTotal(fichas, 'MISMO_BANCO') | currency }}</span>
        </span>

      </span>

      <span flex></span>
      <sx-fichas-filter [filter]="filter$ | async" (aplicar)="onFilterChange($event)"></sx-fichas-filter>
      <span>
        <button mat-icon-button [matMenuTriggerFor]="toolbarMenu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #toolbarMenu="matMenu">
          <button mat-menu-item  (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
          <a mat-menu-item  color="accent"  (click)="generar(filter)" *ngIf="filter$ | async as filter">
            <mat-icon>perm_data_setting</mat-icon> Generar
          </a>
          <button mat-menu-item (click)="reporteDeRelacionDeFichas(filter)" *ngIf="filter$ | async as filter">
            <mat-icon matListAvatar>insert_chart</mat-icon> Relación de fichas
          </button>
        </mat-menu>
      </span>
      </div>
      <mat-divider></mat-divider>

      <sx-fichas-table [fichas]="fichas$ | async"
        (select)="onSelect($event)"
        (delete)="onDelete($event)"
        (ingreso)="onIngreso($event)"
        [filter]="search">
      </sx-fichas-table>
      <mat-card-actions>

      </mat-card-actions>
    </mat-card>
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
export class FichasComponent implements OnInit {
  fichas$: Observable<Ficha[]>;
  search = '';
  filter$: Observable<FichaFilter>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService,
    private dialogService: TdDialogService,
    private service: FichasService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getFichasLoading));
    this.fichas$ = this.store.pipe(select(fromStore.getAllFichas));
    this.filter$ = this.store.pipe(select(fromStore.getFichasFilter));
  }

  onFilterChange(filter: FichaFilter) {
    this.store.dispatch(new fromStore.SetFichasFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadFichas());
  }

  generar(filter: FichaFilter) {
    this.dialog
      .open(FichasGenerarComponent, {
        data: { fecha: filter.fecha, tipo: filter.tipo }
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          this.store.dispatch(new fromStore.GenerateFichas({ command }));
        }
      });
  }

  onIngreso(event: Ficha) {
    this.dialogService
      .openConfirm({
        title: 'Tesorería',
        message: `Registrar ingreso de ficha ${event.folio}?`,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(val => {
        this.store.dispatch(new fromStore.RegistrarIngreso({ ficha: event }));
      });
  }

  onEdit(event: Ficha) {}

  onSelect(ficha: Ficha) {
    this.dialog.open(FichaInfoComponent, {
      data: { ficha: ficha },
      width: '750px'
    });
  }

  onDelete(event: Ficha) {
    this.dialogService
      .openConfirm({
        title: `Eliminar ficha ${event.folio}`,
        message:
          'Se eliminara también el ingreso a bancos, si es que ya se generó',
        cancelButton: 'Cancelar',
        acceptButton: 'Eliminar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.DeleteFicha({ ficha: event }));
        }
      });
  }

  getTotal(fichas: Ficha[], tipo: string) {
    return _.sumBy(fichas, item => {
      if (item.tipoDeFicha === tipo) {
        return item.total;
      } else {
        return 0;
      }
    });
  }

  reporteDeRelacionDeFichas(filter: FichaFilter) {
    const dialogRef = this.dialog.open(RelacionFichasComponent, {
      data: { filter }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log('Run report: ', res);
        this.reportService.runReport(
          'tesoreria/fichas/reporteDeRelacionDeFichas',
          res
        );
      }
    });
  }
}
