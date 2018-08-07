import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import { SetPeriodo } from '../../store/actions';

import { Observable } from 'rxjs';
import { Periodo } from '../../../_core/models/periodo';

@Component({
  selector: 'sx-ordenes-page',
  templateUrl: './ordenes-page.component.html'
})
export class OrdenesPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'compras',
      title: 'Compras',
      description: 'Ordenes de compra',
      icon: 'add_shopping_cart'
    },
    {
      route: 'recepciones',
      title: 'Recepciones',
      description: 'Ordenes en tránsito',
      icon: 'flight_land'
    },
    {
      route: 'alcance',
      title: 'Alcances',
      descripcion: 'Alcancees de inventario',
      icon: 'data_usage'
    }
  ];
  periodo$: Observable<Periodo>;
  loading$: Observable<boolean>;
  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getComprasLoading));
    this.periodo$ = this.store.pipe(select(fromStore.getPeriodoDeCompras));
  }

  cambiarPeriodo(event: Periodo) {
    this.store.dispatch(new SetPeriodo(event));
  }
}
