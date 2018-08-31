import { Component, OnInit } from '@angular/core';

import { of as observableOf, Observable } from 'rxjs';

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
      route: 'alcance',
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

  sidenavWidth = 300;

  constructor() {}

  ngOnInit() {}
}
