import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../store';
import * as fromStore from '../../store';

import { Observable, Subject } from 'rxjs';

import { CuentaDeBanco } from 'app/models';
import { Movimiento } from 'app/cuentas/models/movimiento';
import { Periodo } from 'app/_core/models/periodo';
import { MatDialog } from '@angular/material';
import {
  SelectorDeCuentasComponent,
  EstadoDeCuentaTableComponent
} from 'app/cuentas/components';
import { EstadoDeCuenta } from 'app/cuentas/models/estado-de-cuenta';
import { takeUntil } from 'rxjs/operators';
import { PeriodoDialogComponent } from 'app/_shared/components';
import { ReportService } from 'app/reportes/services/report.service';

@Component({
  selector: 'sx-estado-de-cuenta',
  template: `
  <td-layout-nav>
    <div td-toolbar-content layout="row" layout-align="start center" flex>
      <button mat-icon-button td-menu-button tdLayoutToggle>
        <mat-icon>menu</mat-icon>
      </button>
      <span class="cursor-pointer">Estado de cuenta </span> <span flex></span>
    </div>

    <div layout>
      <mat-card flex >
        <div layout class="mat-title pad-top pad-left pad-right">
          <span>Cuenta: </span>
          <span class="cursor-pointer" (click)="seleccionarCuenta(cuentas)" *ngIf="cuentas$ | async as cuentas">

            <span class="pad-left">{{cuenta.descripcion}}</span>
            <span class="pad-left">{{cuenta.tipo}}</span>
            <span class="pad-left">{{cuenta.numero}}</span>
          </span>
          <span flex></span>
          <span>Periodo: </span>
          <button mat-button *ngIf="periodo" class="pad-left" (click)="cambiarPeriodo()">
            {{periodo}}
            <mat-icon>event</mat-icon>
          </button>
        </div>
        <div layout *ngIf="estadoDeCuenta$ | async as estado" class=" pad-left pad-right pad-bottom">
          <span >S. Inicial:</span>
          <span class="pad-left">{{estado.saldoInicial | currency}}</span>
          <span class="pad-left">S. Final:</span>
          <span class="pad-left">{{estado.saldoFinal | currency}}</span>

        </div>

        <mat-divider></mat-divider>

        <div class="table-panel" >

          <sx-estado-de-cuenta-table class="table" #grid
            [movimientos]="movimientos$ | async"
            (totalesChanged)="actualizarTotales($event)"
            (print)="onPrint($event)"
            (printAsEstadoDeCuenta)="onPrintEstadoDeCuenta($event, estado)">
          </sx-estado-de-cuenta-table>
        </div>

        <mat-divider></mat-divider>
        <mat-card-actions>
          <div layout>
            <button mat-button class="text-upper" (click)="regresar()">
              <mat-icon>arrow_back</mat-icon>
              Cuentas
            </button>
            <button mat-button color="accent" class="text-upper" (click)="load(cuenta, periodo)">
              <span>Refrescar</span>
              <mat-icon>refresh</mat-icon>
            </button>
            <button mat-button color="primary" (click)="grid.printGrid()">
              <mat-icon>print</mat-icon> Imprimir
            </button>
            <button mat-button color="primary" (click)="grid.printEstadoDeCuenta()">
              <mat-icon>picture_as_pdf</mat-icon> Estado de cuenta
            </button>
            <span flex></span>
            <span>Depósitos: {{depositos | currency}}</span>
            <span class="pad-left">Retiros: {{retiros | currency}}</span>
            <span flex></span>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
    <td-layout-footer>
      <sx-footer></sx-footer>
    </td-layout-footer>
  </td-layout-nav>
  `,
  styles: [
    `
      .table-panel {
        height: 700px;
      }
    `
  ]
})
export class EstadoDeCuentaComponent
  implements OnInit, AfterViewInit, OnDestroy {
  estadoDeCuenta$: Observable<EstadoDeCuenta>;
  estado: EstadoDeCuenta;
  cuentas$: Observable<CuentaDeBanco[]>;
  loading$: Observable<boolean>;

  destroy$ = new Subject<boolean>();
  periodo: Periodo;
  cuenta: CuentaDeBanco;

  depositos = 0.0;
  retiros = 0.0;

  movimientos$: Observable<Movimiento[]>;
  periodoStorageKey = 'sx-tesoreria.estadoDeCuenta.periodo';

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private service: ReportService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getEstadoDeCuentaLoading));

    this.periodo = Periodo.fromStorage(
      this.periodoStorageKey,
      Periodo.monthToDay()
    );
    this.cuentas$ = this.store.pipe(select(fromStore.getAllCuentas));
    const cta$ = this.store.pipe(select(fromStore.getCurrentCuenta));

    cta$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cuenta => (this.cuenta = cuenta));

    this.estadoDeCuenta$ = this.store.pipe(select(fromStore.getEstadoDeCuenta));
    this.estadoDeCuenta$
      .pipe(takeUntil(this.destroy$))
      .subscribe(estado => (this.estado = estado));

    this.movimientos$ = this.store.pipe(select(fromStore.getMovimientos));
  }

  ngAfterViewInit() {
    this.load(this.cuenta, this.periodo);
  }

  load(cuenta: CuentaDeBanco, periodo: Periodo) {
    this.store.dispatch(new fromStore.GetEstado({ cuenta, periodo }));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  seleccionarCuenta(cuentas: CuentaDeBanco[]) {
    const ref = this.dialog.open(SelectorDeCuentasComponent, {
      data: { cuentas },
      width: '650px'
    });
    ref.afterClosed().subscribe((selected: CuentaDeBanco) => {
      if (selected) {
        this.cuenta = selected;
        this.load(this.cuenta, this.periodo);
      }
    });
  }

  regresar() {
    this.store.dispatch(new fromRoot.Go({ path: ['cuentas'] }));
  }

  cambiarPeriodo() {
    this.dialog
      .open(PeriodoDialogComponent, { data: { periodo: this.periodo } })
      .afterClosed()
      .subscribe((periodo: Periodo) => {
        if (periodo) {
          Periodo.saveOnStorage(this.periodoStorageKey, periodo);
          this.periodo = periodo;
          this.load(this.cuenta, this.periodo);
          this.cd.detectChanges();
        }
      });
  }

  actualizarTotales(totales) {
    this.depositos = totales.depositos;
    this.retiros = totales.retiros;
    this.cd.detectChanges();
  }

  onPrint(event: Array<any>) {
    this.service.runReportWithData(
      'tesoreria/cuentas/movimientosReport',
      {
        cuentaId: this.cuenta.id
      },
      {
        rows: event,
        fechaIni: this.periodo.fechaInicial.toISOString(),
        fechaFin: this.periodo.fechaFinal.toISOString()
      }
    );
  }

  onPrintEstadoDeCuenta(event: Array<any>, estado: EstadoDeCuenta) {
    this.service.runReportWithData(
      'tesoreria/cuentas/estadoDeCuentaReport',
      {
        cuentaId: this.cuenta.id,
        saldoInicial: estado.saldoInicial,
        cargos: estado.cargos,
        abonos: estado.abonos,
        saldoFinal: estado.saldoFinal
      },
      {
        rows: event,
        fechaIni: this.periodo.fechaInicial.toISOString(),
        fechaFin: this.periodo.fechaFinal.toISOString()
      }
    );
  }
}
