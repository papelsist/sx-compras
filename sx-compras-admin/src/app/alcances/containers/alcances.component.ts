import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';

import {
  TdLoadingService,
  TdMediaService,
  TdDialogService
} from '@covalent/core';
import { Title } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';

import { finalize } from 'rxjs/operators';

import { MatDialog } from '@angular/material';

import * as _ from 'lodash';
import { AlcancesService } from '../services/alcances.service';
import { Periodo } from '../../_core/models/periodo';
import {
  AlcanceRunDialogComponent,
  AlcanceReportDialogComponent
} from '../components';
import { ComprasPendientesComponent } from '../components/compras-pendientes/compras-pendientes.component';

@Component({
  selector: 'sx-alcances',
  templateUrl: './alcances.component.html',
  styleUrls: ['./alcances.component.scss']
})
export class AlcancesComponent implements OnInit, AfterViewInit {
  rows: any[] = [];
  filteredData: any[] = [];
  selectedRows: any[] = [];
  loading = false;
  ultimaEjecucion;

  constructor(
    private service: AlcancesService,
    private loadingService: TdLoadingService,
    private _changeDetectorRef: ChangeDetectorRef,
    public media: TdMediaService,
    private titleService: Title,
    private dialogService: TdDialogService,
    private dialog: MatDialog,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit(): void {
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
    this.titleService.setTitle('SX Alcances');
  }

  onSelect(event: any[]) {
    this.selectedRows = event;
  }

  load() {
    this.loadingService.register('procesando');
    this.service
      .list()
      .pipe(finalize(() => this.loadingService.resolve('procesando')))
      .subscribe(data => {
        this.rows = data;
        this.filteredData = [...this.rows];
        if (data.length > 0) {
          const row = data[0];
          this.ultimaEjecucion = {
            fechaInicial: row.fechaInicial,
            fechaFinal: row.fechaFinal,
            meses: row.meses
          };
        }
      });
  }

  ejecutar() {
    this.dialog
      .open(AlcanceRunDialogComponent, {
        data: { periodo: Periodo.fromNow(60) }
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.ultimaEjecucion = res;
          this.doEjecutar(res);
        }
      });
  }

  private doEjecutar(command) {
    this.loadingService.register('procesando');
    this.service
      .generar(command)
      .pipe(finalize(() => this.loadingService.resolve('procesando')))
      .subscribe(data => {
        this.rows = data;
        this.filteredData = [...this.rows];
      });
  }

  generarOrden() {
    const found = _.find(this.selectedRows, item => item.proveedor);
    if (found) {
      const partidas = _.filter(
        this.selectedRows,
        item => item.proveedor === found.proveedor
      );
      this.dialogService
        .openConfirm({
          title: 'Generar orden de compra',
          message: `${found.nombre}      Productos: ${partidas.length}`,
          acceptButton: 'Aceptar',
          cancelButton: 'Cancelar'
        })
        .updateSize('600px', '200px')
        .afterClosed()
        .subscribe(res => {
          if (res) {
            this.service
              .generarOrden(found.proveedor, partidas)
              .subscribe(oc => {
                // this.load();
                this.store.dispatch(
                  new fromRoot.Go({ path: ['ordenes', oc.id] })
                );
              });
          }
        });
    }
  }

  actualizarMeses() {
    this.dialogService
      .openPrompt({
        title: 'Meses para alcance',
        message: 'Digite el numero de meses',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          if (_.isNumber(_.toNumber(res))) {
            this.loadingService.register('procesando');
            this.service
              .actualizarMeses(res)
              .pipe(finalize(() => this.loadingService.resolve('procesando')))

              .subscribe(data => this.load());
          }
        }
      });
  }

  get existenciaAcumulada() {
    if (this.filteredData.length > 0) {
      return _.sumBy(this.filteredData, item => item.existenciaEnToneladas);
    }
    return 0;
  }

  get promVtaEnToneladas() {
    if (this.filteredData.length > 0) {
      return _.sumBy(this.filteredData, item => item.promVtaEnToneladas);
    }
    return 0;
  }

  get porPedirToneladas() {
    if (this.filteredData.length > 0) {
      return _.sumBy(this.filteredData, item => item.porPedirKilos / 1000);
    }
    return 0;
  }

  showPendientes(event: any) {
    this.service.comprasPendientes(event.clave).subscribe(
      data => {
        this.dialog.open(ComprasPendientesComponent, {
          data: { partidas: data },
          width: '1100px'
        });
      },
      error => console.log('Error: ', error)
    );
  }

  generarReporte() {
    const dialogRef = this.dialog
      .open(AlcanceReportDialogComponent, {
        data: { periodo: Periodo.monthsAgo(2) }
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.doRunReport(res);
        }
      });
  }

  doRunReport(params) {
    this.loadingService.register('procesando');
    this.service
      .reporte(params)
      .pipe(finalize(() => this.loadingService.resolve('procesando')))
      .subscribe(
        res => {
          const blob = new Blob([res], {
            type: 'application/pdf'
          });
          const fileURL = window.URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        },
        error2 => console.error(error2)
      );
  }
}
