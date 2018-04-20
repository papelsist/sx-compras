import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
      icon: 'group',
      route: '/clientes',
      title: 'Clientes'
    },
    {
      icon: 'shopping_cart',
      route: '/ordenes',
      title: 'Ordenes'
    },
    {
      icon: 'insert_invitation',
      route: '/solicitudes',
      title: 'Solicitudes'
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

  ngOnInit() {
    this.modulo$ = Observable.of('PENDIENTE');
  }
}
