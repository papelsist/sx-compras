import { Component, OnInit } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from 'app/store';
import * as fromAuth from 'app/auth/store';

import * as fromActions from '../../store/actions';

import { Observable } from 'rxjs';

import { User } from 'app/auth/models/user';
import { VentaAcumulada } from 'app/analisis-de-ventas/models/ventaAcumulada';

@Component({
  selector: 'sx-analisis-de-venta-page',
  templateUrl: './analisis-de-venta-page.component.html',
  styleUrls: ['./analisis-de-venta-page.component.scss']
})
export class AnalisisDeVentaPageComponent implements OnInit {
  user$: Observable<User>;
  api$: Observable<any>;

  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(fromAuth.getUser));
    this.api$ = this.store.pipe(select(fromAuth.getApiInfo));
  }

  onAplicar(event: VentaAcumulada) {
    this.store.dispatch(new fromActions.SetVentaNetaFilter({ filter: event }));
  }
}
