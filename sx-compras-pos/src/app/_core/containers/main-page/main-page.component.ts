import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import * as fromAuth from 'app/auth/store';

import { Observable } from 'rxjs';
import { AuthSession } from 'app/auth/models/authSession';
import { Sucursal } from '../../../models';

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
      icon: 'border_color',
      route: '/requisiciones',
      title: 'Requisiciones'
    },
    {
      icon: 'shopping_cart',
      route: '/ordenes',
      title: 'Ordenes'
    },
    {
      icon: 'flight_land',
      route: '/recepciones',
      title: 'Recepciones'
    },
    {
      route: '/alcances',
      title: 'Alcances',
      icon: 'data_usage'
    },
    {
      route: '/cajas',
      title: 'Cajas',
      icon: 'widgets'
    }
  ];

  usermenu: Array<{ icon: string; route: string; title: string }> = [
    {
      icon: 'exit_to_app',
      route: '/logout',
      title: 'Salir del sistema'
    }
  ];

  modulo$: Observable<string>;
  loading$: Observable<boolean>;
  sucursal$: Observable<Sucursal>;

  sidenavWidth = 300;
  session$: Observable<AuthSession>;

  constructor(private store: Store<fromAuth.AuthState>) {}

  ngOnInit() {
    this.session$ = this.store.pipe(select(fromAuth.getSession));
  }

  logout() {
    this.store.dispatch(new fromAuth.Logout());
  }
}
