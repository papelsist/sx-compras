import { Component, OnInit } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromAuth from 'app/auth/store';

import { Observable } from 'rxjs';
import { User } from 'app/auth/models/user';

@Component({
  selector: 'sx-embarques-page',
  templateUrl: './embarques-page.component.html',
  styleUrls: ['./embarques-page.component.scss']
})
export class EmbarquesPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'comisiones',
      title: 'Comisiones',
      description: 'Comisiones sobre envios',
      icon: 'account_balance_wallet'
    },
    {
      route: 'prestamos',
      title: 'Prestamos',
      description: 'Prestamos a choferes',
      icon: 'receipt'
    },
    {
      route: 'cargos',
      title: 'Cargos',
      description: 'Cargos diversos a choferes',
      icon: 'gradient'
    },
    {
      route: 'pagos',
      title: 'Pagos ',
      description: 'Pagos de comisiones',
      icon: 'money_off'
    },
    {
      route: 'cobros',
      title: 'Cobros',
      descripcion: 'Cobros a choferes'
    }
  ];

  user$: Observable<User>;
  api$: Observable<any>;

  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(fromAuth.getUser));
    this.api$ = this.store.pipe(select(fromAuth.getApiInfo));
  }
}
