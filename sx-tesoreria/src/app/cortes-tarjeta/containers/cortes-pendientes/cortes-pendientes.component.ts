import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { MatDialog } from '@angular/material';
import { TdLoadingService } from '@covalent/core';

import { CorteDeTarjetaService } from '../../services';
import { CobroTarjetaDialogComponent } from '../../components';

@Component({
  selector: 'sx-cortes-pendientes',
  templateUrl: './cortes-pendientes.component.html'
})
export class CortesPendientesComponent implements OnInit, OnDestroy {
  grupos$: Observable<any>;
  sucursales$: Observable<string[]>;
  _fecha: Date = new Date();
  procesando = false;
  skey = 'cortes-tarjeta.cortes-pendientes.filtro';
  constructor(
    private service: CorteDeTarjetaService,
    private _loadingService: TdLoadingService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const jsonFecha = JSON.parse(localStorage.getItem(this.skey));
    if (jsonFecha) {
      this.fecha = new Date(jsonFecha);
    }
    this.load();
  }

  ngOnDestroy() {
    localStorage.setItem(this.skey, JSON.stringify(this.fecha.toJSON()));
  }

  load() {
    this.procesando = true;
    this.grupos$ = this.service
      .pendientes({
        fechaInicial: this.fecha.toISOString(),
        fechaFinal: this.fecha.toISOString()
      })
      .pipe(
        tap(res => console.log('Res: ', res)),
        finalize(() => (this.procesando = false))
      );
    // this.sucursales$ = this.grupos$.map(res => _.keys(res));
  }

  get fecha() {
    return this._fecha;
  }
  set fecha(val) {
    this._fecha = val;
    this.load();
  }

  onGenerar(cobrosPorSucursal: any) {
    this.procesando = true;
    this._loadingService.register();
    this.service
      .generar(cobrosPorSucursal)
      .pipe(finalize(() => this._loadingService.resolve()))
      .subscribe(cortes => {
        console.log('Cortes de tarjeta generados: ', cortes);
        this.load();
      });
  }

  onEditCobro(cobro) {
    this.dialog
      .open(CobroTarjetaDialogComponent, {
        data: { cobro: { ...cobro } },
        width: '400px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          cobro.cobro.importe = res.importe;
          cobro.debitoCredito = res.debitoCredito;
          cobro.visaMaster = res.visaMaster;
          this.doUpdateCobro(cobro);
        }
      });
  }

  private doUpdateCobro(cobro) {
    console.log('Salvando cobro: ', cobro);
    this.service.updateCobro(cobro).subscribe(cc => {
      this.load();
    });
  }
}
