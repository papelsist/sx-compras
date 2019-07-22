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

  @HostListener('document:keydown.control.p', ['$event'])
  onConsultaDeProveedores(event) {
    this.proveedorUtils.consultaRapida();
  }

  logout() {
    this.store.dispatch(new fromAuth.Logout());
  }
}
