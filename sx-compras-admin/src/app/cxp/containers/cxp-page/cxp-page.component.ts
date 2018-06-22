import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';
import { TdMediaService } from '@covalent/core';

import { RepPeriodoSucursalComponent } from 'app/reportes/components';

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
    }
  ];
  constructor(public media: TdMediaService, private dialog: MatDialog) {}

  ngOnInit() {}

  entradasAnalizadas() {
    this.dialog
      .open(RepPeriodoSucursalComponent, {
        data: { title: '' },
        width: '500px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          console.log('Ejecutar con: ', res);
        }
      });
  }
}
