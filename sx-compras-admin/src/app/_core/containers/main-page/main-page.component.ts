import { Component, OnInit, HostListener } from '@angular/core';

import { of as observableOf, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromAuth from 'app/auth/store';
import { AuthSession } from '../../../auth/models/authSession';

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
      icon: 'exit_to_app',
      route: '/logout',
      title: 'Salir del sistema'
    }
  ];

  modulo$: Observable<string>;

  sidenavWidth = 300;

  session$: Observable<AuthSession>;

  constructor(
    private store: Store<fromAuth.AuthState>,
    private proveedorUtils: ProveedorUtilsService
  ) {}

  ngOnInit() {
    this.modulo$ = observableOf('PENDIENTE');
    this.session$ = this.store.pipe(select(fromAuth.getSession));
  }

  @HostListener('document:keydown.control.shift.t', ['$event'])
  onConsultaDeProveedores(event) {
    this.proveedorUtils.consultaRapida();
  }

  @HostListener('document:keydown', ['$event'])
  consultaDeInventario(event: KeyboardEvent) {
    if (event.altKey || event.metaKey) {
      // console.log('Alt + key:', event.key);
      // console.log('Alt + keyCode:', event.keyCode);
    }
  }

  logout() {
    this.store.dispatch(new fromAuth.Logout());
  }
}
