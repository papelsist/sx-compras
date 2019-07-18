import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';

import * as fromStore from '../../store';

import { Observable, Subject } from 'rxjs';

import { CarteraFilter, SolicitudDeDeposito, Cartera } from '../../models';
import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';

import { TdDialogService } from '@covalent/core';
import { FechaDialogComponent } from 'app/_shared/components';
import { pluck, takeUntil } from 'rxjs/operators';
import { SolicitudFormComponent } from 'app/cobranza/components';
import { ActivatedRoute } from '@angular/router';
import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-solicitudes',
  template: `
  <mat-card *ngIf="cartera">
    <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Solicitudes de depósito: {{cartera.descripcion}}" (search)="search = $event">

        <sx-cartera-filter-btn
          class="options"
          [filter]="filter$ | async"
          (change)="onFilterChange($event)"></sx-cartera-filter-btn>

        <button mat-menu-item class="actions" (click)="reload(cartera)"><mat-icon>refresh</mat-icon> Recargar</button>
      </sx-search-title>
      <mat-divider></mat-divider>

      <sx-solicitudes-table [solicitudes]="solicitudes$ | async"
        [filter]="search"
        (edit)="onEdit($event)"
        (select)="onSelect($event)">
      </sx-solicitudes-table>

      <mat-card-footer *ngIf="filter">
        <sx-cartera-filter-label [filter]="filter"></sx-cartera-filter-label>
      </mat-card-footer>

      <a mat-fab matTooltip="Nueva solicitud"
        matTooltipPosition="before" color="accent"
        class="mat-fab-position-bottom-right z-3"
        (click)="onCreate(cartera) ">
        <mat-icon>add</mat-icon>
      </a>
      </ng-template>
    </mat-card>
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
export class SolicitudesComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  solicitudes$: Observable<SolicitudDeDeposito[]>;
  search = '';
  filter$: Observable<CarteraFilter>;
  filter: CarteraFilter;

  cartera: Cartera = new Cartera('CHO', 'CHOFER');
  destroy$ = new Subject<boolean>();

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      // this.cartera = data.cartera;
      this.loadFilter();
      this.reload(this.cartera, this.filter);
    });
    this.loading$ = this.store.pipe(select(fromStore.getSolicitudesLoading));
    this.solicitudes$ = this.store.pipe(select(fromStore.getAllSolicitudes));

    // this.filter$ = this.store.pipe(select(fromStore.getSolicitudesFilter));
    this.loadFilter();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  loadFilter() {
    const periodo = Periodo.fromStorage(
      'sx.cxc.solicitudes',
      Periodo.fromNow(20)
    );
    this.filter = { ...periodo, registros: 50 };
  }

  onFilterChange(filter: CarteraFilter) {
    // this.store.dispatch(new fromStore.SetSolicitudesFilter({ filter }));
  }

  reload(cartera: Cartera, filter?: CarteraFilter) {
    this.store.dispatch(
      new fromStore.LoadSolicitudes({ cartera: cartera.clave, filter })
    );
  }

  onSelect(event: SolicitudDeDeposito) {
    this.dialog.open(SolicitudFormComponent, {
      data: { cartera: this.cartera, solicitud: event, readOnly: true },
      width: '650px'
    });
  }

  onCreate(cartera: Cartera) {
    // this.store.dispatch(new fromStore.CreateSolicitud({ cartera }));
    this.dialog
      .open(SolicitudFormComponent, {
        data: { cartera },
        width: '750px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromStore.CreateSolicitud({ solicitud: res })
          );
        }
      });
  }

  onEdit(event: SolicitudDeDeposito) {
    this.dialog
      .open(SolicitudFormComponent, {
        data: {
          cartera: this.cartera,
          solicitud: event,
          readOnly: !event.comentario
        },
        width: '650px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromStore.UpdateSolicitud({
              update: { id: event.id, changes: res }
            })
          );
        }
      });
  }
}
