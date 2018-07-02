import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Proveedor } from '../../models/proveedor';

@Component({
  selector: 'sx-proveedor-page',
  templateUrl: './proveedor-page.component.html',
  styleUrls: ['./proveedor-page.component.scss']
})
export class ProveedorPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'info',
      title: 'Generales',
      description: 'Información general',
      icon: 'assignment_ind'
    },
    {
      route: 'productos',
      title: 'Productos',
      descripcion: 'Productos del proveedor',
      icon: 'layers'
    }
  ];

  proveedor$: Observable<Proveedor>;

  reportes: Object[] = [];

  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.ProveedoresState>
  ) {}

  ngOnInit() {
    this.proveedor$ = this.store.pipe(select(fromStore.getCurrentProveedor));
  }
}
