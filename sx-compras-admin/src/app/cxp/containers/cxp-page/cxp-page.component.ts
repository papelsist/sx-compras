import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';

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
  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
