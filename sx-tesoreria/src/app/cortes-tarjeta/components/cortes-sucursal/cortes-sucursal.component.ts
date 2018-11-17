import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges
} from '@angular/core';
import * as _ from 'lodash';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-cortes-sucursal',
  templateUrl: './cortes-sucursal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CortesSucursalComponent implements OnInit, OnChanges {
  @Input()
  cobrosPorSucursal: { sucursal: string; cobros: any[]; fecha: string };
  @Output() generar = new EventEmitter<any>();
  @Output() editCobro = new EventEmitter();

  totalDebito = 0.0;
  totalCredito = 0.0;
  totalAmex = 0.0;

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.cobrosPorSucursal) {
      const visam = this.cobrosPorSucursal.cobros.filter(
        item => item.tipo === 'VISA_MASTER'
      );
      this.totalDebito = _.sumBy(visam, item => {
        if (item.subTipo === 'DEBITO') {
          return item.total;
        } else {
          return 0.0;
        }
      });
      this.totalCredito = _.sumBy(visam, item => {
        if (item.subTipo === 'CREDITO') {
          return item.total;
        } else {
          return 0.0;
        }
      });
      this.totalAmex = _.sumBy(this.cobrosPorSucursal.cobros, item => {
        if (item.tipo === 'AMEX') {
          return item.total;
        } else {
          return 0.0;
        }
      });
    }
  }

  get totalVisaMastercard() {
    return this.totalDebito + this.totalCredito;
  }
  get comisionDebito() {
    return _.round(this.totalDebito * (1.46 / 100), 2);
  }
  get comisionDebitoIva() {
    return _.round(this.comisionDebito * 0.16, 2);
  }
  get comisionCredito() {
    return _.round(this.totalCredito * (2.36 / 100), 2);
  }
  get comisionCreditoIva() {
    return _.round(this.comisionCredito * 0.16, 2);
  }

  get comisionAmex() {
    return _.round(this.totalAmex * (3.8 / 100), 2);
  }
  get comisionAmexIva() {
    return _.round(this.comisionAmex * 0.16, 2);
  }

  generarCorte() {
    this.dialogService
      .openConfirm({
        title: 'Core de tarjeta',
        message: 'Generar el corte de tarjeta para esta sucursal',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          console.log('Generar el corte de la fecha: ');
          this.generar.emit(this.cobrosPorSucursal);
        }
      });
  }
}
