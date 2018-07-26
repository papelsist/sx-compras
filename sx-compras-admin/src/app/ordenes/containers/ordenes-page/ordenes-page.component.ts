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
      route: 'pendientes',
      title: 'Pendientes',
      description: 'Alta de ordenes',
      icon: 'repeat'
    },
    {
      route: 'transito',
      title: 'Transito',
      description: 'Ordenes en tránsito',
      icon: 'swap_horiz'
    },
    {
      route: 'atendidas',
      title: 'Atendidas',
      descripcion: 'Ordenes atendidas',
      icon: 'cancel'
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
