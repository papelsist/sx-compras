import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';
import { TdMediaService } from '@covalent/core';

import { RepPeriodoSucursalComponent } from 'app/reportes/components';
import { ReportService } from '../../../reportes/services/report.service';

@Component({
  selector: 'sx-cxp-page',
  templateUrl: './cxc-page.component.html'
})
export class CxpPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'cfdis',
      title: 'CFDIs',
      description: 'Comprobantes fiscales',
      icon: 'account_balance_wallet'
    },
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
    }
  ];
  constructor(
    public media: TdMediaService,
    private dialog: MatDialog,
    private reportService: ReportService
  ) {}

  ngOnInit() {}

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
}
