import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';
import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { RepPeriodoSucursalComponent } from 'app/reportes/components';
import { ReportService } from '../../../reportes/services/report.service';
import { ReportComsSinAnalizarComponent } from '../../components';

@Component({
  selector: 'sx-cxp-page',
  templateUrl: './cxc-page.component.html'
})
export class CxpPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'analisis',
      title: 'Análisis',
      description: 'Análisis de facturas',
      icon: 'rate_review'
    },
    {
      route: 'requisiciones',
      title: 'Requisiciones',
      description: 'Requisiciones',
      icon: 'gradient'
    },
    {
      route: 'facturas',
      title: 'Facturas',
      description: 'Facturas (CFDIs)',
      icon: 'receipt'
    },
    {
      route: 'pagos',
      title: 'Pagos ',
      description: 'Pagos registrados',
      icon: 'money_off'
    },
    {
      route: 'notas',
      title: 'Notas ',
      description: 'Notas de crédito',
      icon: 'description'
    },
    {
      route: 'recibos',
      title: 'Recibos ',
      description: 'Recibos electrónicos de pago',
      icon: 'confirmation_number'
    },
    {
      route: 'contrarecibos',
      title: 'Contrarecibos ',
      description: 'Contrarecibos',
      icon: 'rate_review'
    },
    {
      route: 'cfdis',
      title: 'CFDIs',
      description: 'Comprobantes fiscales',
      icon: 'account_balance_wallet'
    }
  ];

  tableros: Object[] = [
    {
      route: 'cartera',
      title: 'Cuentas x Pagar',
      description: 'Facturas pendientes de pago',
      icon: 'storage'
    },
    {
      route: 'ecuenta/facs',
      title: 'Edo. de cuenta (F)',
      description: 'Por Factura',
      icon: 'format_indent_increase'
    },
    {
      route: 'ecuenta/movs',
      title: 'Edo. de cuenta (M)',
      description: 'Por Movimientos',
      icon: 'list'
    }
  ];

  loading$: Observable<boolean>;

  constructor(
    public media: TdMediaService,
    private dialog: MatDialog,
    private reportService: ReportService,
    private store: Store<fromStore.CxpState>
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getNotasLoading));
  }

  entradasAnalizadas() {
    this.dialog
      .open(RepPeriodoSucursalComponent, {
        data: { title: '' },
        width: '500px'
      })
      .afterClosed()
      .subscribe(params => {
        if (params) {
          this.reportService.runReport(
            'analisisDeFactura/entradasAnalizadas',
            params
          );
        }
      });
  }

  comsSinAnalizar() {
    this.dialog
      .open(ReportComsSinAnalizarComponent, {
        data: {},
        width: '500px'
      })
      .afterClosed()
      .subscribe(params => {
        if (params) {
          this.reportService.runReport(
            'analisisDeFactura/comsSinAnalizar',
            params
          );
        }
      });
  }
}
