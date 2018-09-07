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
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MatDialog } from '@angular/material';

import * as _ from 'lodash';
import { AlcancesService } from '../services/alcances.service';
import { Periodo } from '../../_core/models/periodo';

// import { AlcanceRunDialogComponent } from 'app/compras/_pages/alcances/alcance-run-dialog/alcance-run-dialog.component';
// import { AlcanceReportDialogComponent } from 'app/compras/_pages/alcances/alcance-report-dialog/alcance-report-dialog.component';

@Component({
  selector: 'sx-alcances',
  templateUrl: './alcances.component.html'
})
export class AlcancesComponent implements OnInit, AfterViewInit {
  rows: any[] = [];
  filteredData: any[] = [];
  selectedRows: any[] = [];

  sideNavWidth = '250px';
  filtros = [
    { nombre: 'proveedor', descripcion: 'Proveedor' },
    { nombre: 'producto', descripcion: 'Producto' },
    { nombre: 'linea', descripcion: 'Línea' },
    { nombre: 'marca', descripcion: 'Marca' },
    { nombre: 'clase', descripcion: 'Clase' },
    { nombre: 'alcanceMenor', descripcion: 'Alc menor igual a' },
    { nombre: 'alcanceMayor', descripcion: 'Alc mayor a' }
  ];

  searchForm: FormGroup;

  ultimaEjecucion;

  constructor(
    private service: AlcancesService,
    private loadingService: TdLoadingService,
    private _changeDetectorRef: ChangeDetectorRef,
    public media: TdMediaService,
    private titleService: Title,
    private dialogService: TdDialogService,
    private dialog: MatDialog
  ) {
    this.searchForm = new FormGroup({
      producto: new FormControl(''),
      proveedor: new FormControl(''),
      linea: new FormControl(''),
      marca: new FormControl(''),
      clase: new FormControl(''),
      alcanceMenor: new FormControl(''),
      alcanceMayor: new FormControl('')
    });
    this.searchForm.valueChanges.subscribe(filtro => {
      this.load();
    });
  }

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit(): void {
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
    this.titleService.setTitle('SX Alcances');
  }

  onSearch(event: string) {
    console.log('Filtrando: ', event);
  }

  load() {
    this.loadingService.register('procesando');
    this.service
      .list(this.searchForm.value)
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
    /*
    const dialogRef = this.dialog
      .open(AlcanceRunDialogComponent, {
        data: { periodo: Periodo.fromNow(60) }
      })
      .afterClosed()
      .subscribe(res => {
        this.ultimaEjecucion = res;
        this.doEjecutar(res);
      });
      */
  }
  /*
  private doEjecutar(command) {
    this.loadingService.register('procesando');
    this.service
      .generar(command)
      .finally(() => this.loadingService.resolve('procesando'))
      .catch(err => Observable.of(err))
      .subscribe(data => {
        this.rows = data;
        this.filteredData = [...this.rows];
      });
  }*/
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
            console.log('Proveedor: ', found.nombre);
            console.log('Partidas ', partidas.length);
            this.service
              .generarOrden(found.proveedor, partidas)
              .subscribe(oc => {
                console.log('Orden generada: ', oc);
                this.load();
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
        if (_.isNumber(_.toNumber(res))) {
          this.loadingService.register('procesando');
          this.service
            .actualizarMeses(res)
            // .finally(() => this.loadingService.resolve('procesando'))
            .subscribe(data => this.load());
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

  generarReporte() {
    /*
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
      */
  }

  doRunReport(params) {
    this.loadingService.register('procesando');
    this.service
      .reporte(params)
      // .finally(() => this.loadingService.resolve('procesando'))
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
