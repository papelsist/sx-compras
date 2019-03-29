import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from 'app/store';
import * as fromAuth from '../../../auth/store';

import { of, Observable } from 'rxjs';
import { User } from 'app/auth/models/user';

@Component({
  selector: 'sx-main-page',
  templateUrl: './main-page.component.html',
  styles: []
})
export class MainPageComponent implements OnInit {
  navigation: Array<{ icon: string; route: string; title: string }> = [
    {
      icon: 'home',
      route: '/',
      title: 'Inicio'
    },
    {
      icon: 'people',
      route: '/proveedores',
      title: 'Proveedores'
    },
    {
      icon: 'my_library_books',
      route: '/cxp',
      title: 'Cuentas por pagar (CXP)'
    },
    {
      icon: 'local_shipping',
      route: '/embarques',
      title: 'Control de embarques'
    }
  ];

  usermenu: Array<{ icon: string; route: string; title: string }> = [
    {
      icon: 'tune',
      route: '.',
      title: 'Cuenta'
    }
  ];

  modulo$: Observable<string>;
  expiration$: Observable<any>;
  apiInfo$: Observable<any>;
  user: User;

  sidenavWidth = 300;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.modulo$ = of('SX Gastos');
    this.store.dispatch(new fromAuth.LoadUserSession());

    this.expiration$ = this.store.pipe(select(fromAuth.getSessionExpiration));
    this.apiInfo$ = this.store.pipe(select(fromAuth.getApiInfo));

    this.store.pipe(select(fromAuth.getUser)).subscribe(u => (this.user = u));
  }

  logout() {
    this.store.dispatch(new fromAuth.Logout());
  }
}
