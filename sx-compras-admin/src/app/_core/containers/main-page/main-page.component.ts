import { Component, OnInit, HostListener } from '@angular/core';

import { of as observableOf, Observable } from 'rxjs';
import { ProveedorUtilsService } from 'app/proveedores/services/proveedor-utils.service';

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
      icon: 'storage',
      route: '/catalogos',
      title: 'Productos'
    },
    {
      icon: 'people',
      route: '/proveedores',
      title: 'Proveedores'
    },
    {
      icon: 'shopping_cart',
      route: '/ordenes',
      title: 'Ordenes'
    },
    {
      icon: 'my_library_books',
      route: '/cxp',
      title: 'Cuentas por pagar (CXP)'
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

  constructor(private proveedorUtils: ProveedorUtilsService) {}

  ngOnInit() {
    this.modulo$ = observableOf('PENDIENTE');
  }

  @HostListener('document:keydown.control.p', ['$event'])
  onConsultaDeProveedores(event) {
    this.proveedorUtils.consultaRapida();
  }
}
