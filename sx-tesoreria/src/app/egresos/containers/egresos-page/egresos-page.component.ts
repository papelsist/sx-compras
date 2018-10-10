import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';

@Component({
  selector: 'sx-egresos-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './egresos-page.component.html'
})
export class EgresosPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'compras',
      title: 'Compras',
      description: 'Pago de compras',
      icon: 'account_balance_wallet'
    },
    {
      route: 'gastos',
      title: 'Gastos',
      description: 'Pago de gastos',
      icon: 'receipt'
    },
    {
      route: 'cheques',
      title: 'Cheques',
      description: 'Pagos con cheque',
      icon: 'account_balance_wallet'
    }
  ];

  loading$: Observable<boolean>;

  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
