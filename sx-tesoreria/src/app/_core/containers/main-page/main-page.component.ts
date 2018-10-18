import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from 'app/store';
import * as fromAuth from 'app/auth/store';
import { AuthSession } from '../../../auth/models/authSession';

import { of, Observable, Subscription } from 'rxjs';

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
      icon: 'my_library_books',
      route: '/egresos',
      title: 'Egresos'
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

  sidenavWidth = 300;

  session: AuthSession;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.modulo$ = of('SX Tesoreía');
    this.store
      .pipe(select(fromAuth.getSession))
      .subscribe(ses => (this.session = ses));
  }

  ngOnDestroy() {}

  logout() {
    this.store.dispatch(new fromAuth.Logout());
  }
}
