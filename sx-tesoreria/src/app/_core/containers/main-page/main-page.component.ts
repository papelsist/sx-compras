import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from 'app/store';
import * as fromAuth from 'app/auth/store';

import { of, Observable } from 'rxjs';
import { User } from 'app/auth/models/user';

@Component({
  selector: 'sx-main-page',
  templateUrl: './main-page.component.html',
  styles: []
})
export class MainPageComponent implements OnInit, OnDestroy {
  navigation: Array<{ icon: string; route: string; title: string }> = [
    {
      icon: 'home',
      route: '/',
      title: 'Inicio'
    },
    {
      icon: 'toc',
      route: '/cuentas',
      title: 'Cuentas de banco'
    },
    {
      icon: 'file_download',
      route: '/egresos',
      title: 'Egresos'
    },
    {
      icon: 'my_library_books',
      route: '/ingresos',
      title: 'Ingresos'
    },
    {
      icon: 'storage',
      route: '/movimientos',
      title: 'Movimientos de tesorería'
    },
    {
      icon: 'credit_card',
      route: '/cortesTarjeta',
      title: 'Cortes de tarjeta'
    }
  ];

  usermenu: Array<{ icon: string; route: string; title: string }> = [
    {
      icon: 'person',
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
    this.modulo$ = of('SX Tesoreía');
    this.store.dispatch(new fromAuth.LoadUserSession());

    this.expiration$ = this.store.pipe(select(fromAuth.getSessionExpiration));
    this.apiInfo$ = this.store.pipe(select(fromAuth.getApiInfo));

    this.store.pipe(select(fromAuth.getUser)).subscribe(u => (this.user = u));
  }

  ngOnDestroy() {}

  logout() {
    this.store.dispatch(new fromAuth.Logout());
  }
}
