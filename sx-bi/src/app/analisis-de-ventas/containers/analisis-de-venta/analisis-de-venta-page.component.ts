import { Component, OnInit, ViewChild } from '@angular/core';

import { TdMediaService, TdLayoutNavListComponent } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from 'app/store';
import * as fromAuth from 'app/auth/store';
import * as fromVentas from '../../store';
import * as fromActions from '../../store/actions';

import { Observable } from 'rxjs';

import { User } from 'app/auth/models/user';
import { VentaFilter } from 'app/analisis-de-ventas/models/venta-filter';
import { VentaNeta } from 'app/analisis-de-ventas/models/venta-neta';

@Component({
  selector: 'sx-analisis-de-venta-page',
  templateUrl: './analisis-de-venta-page.component.html',
  styleUrls: ['./analisis-de-venta-page.component.scss']
})
export class AnalisisDeVentaPageComponent implements OnInit {
  user$: Observable<User>;
  api$: Observable<any>;
  selected$: Observable<VentaNeta>;

  @ViewChild(TdLayoutNavListComponent)
  navList;

  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(fromAuth.getUser));
    this.api$ = this.store.pipe(select(fromAuth.getApiInfo));
    this.selected$ = this.store.pipe(select(fromVentas.getSelectedVenta));
    this.selected$.subscribe(row => {
      if (row) {
        this.navList.close();
      } else {
        this.navList.open();
      }
    });
  }

  onAplicar(event: VentaFilter) {
    this.store.dispatch(new fromActions.SetVentaNetaFilter({ filter: event }));
  }
}
