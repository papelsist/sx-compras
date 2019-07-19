import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
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
    }
  ];

  usermenu: Array<{ icon: string; route: string; title: string }> = [
    {
      icon: 'swap_horiz',
      route: '.',
      title: 'Cambio de usuario'
    },
    {
      icon: 'tune',
      route: '.',
      title: 'Cuenta'
    },
    {
      icon: 'exit_to_app',
      route: '.',
      title: 'Salir del sistema'
    }
  ];

  modulo$: Observable<string>;
  loading$: Observable<boolean>;
  sucursal$: Observable<Sucursal>;

  sidenavWidth = 300;
  session$: Observable<AuthSession>;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.session$ = this.store.pipe(select(fromAuth.getSession));
  }
}
