import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/compra.actions';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Compra } from '../../models/compra';

import * as _ from 'lodash';
import { CompraDet } from '../../models/compraDet';

@Component({
  selector: 'sx-compras',
  templateUrl: './compras.component.html'
})
export class ComprasComponent implements OnInit, OnDestroy {
  comprasPorSucursal$: Observable<any>;
  sucursales$: Observable<string[]>;
  partidas$: Observable<CompraDet[]>;

  search$: Observable<string>;
  tabIndex = 2;
  private _storageKey = 'sx-compras.ordenes';
  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.comprasPorSucursal$ = this.store.pipe(
      select(fromStore.getComprasPorSucursalPendientes)
    );
    this.sucursales$ = this.comprasPorSucursal$.pipe(map(res => _.keys(res)));
    this.search$ = this.store.pipe(select(fromStore.getComprasSearchTerm));

    // Tab Idx
    const _tabIdx = localStorage.getItem(this._storageKey + '.tabIndex');
    this.tabIndex = parseFloat(_tabIdx);

    this.partidas$ = this.store.pipe(select(fromStore.getSelectedPartidas));
  }

  ngOnDestroy() {
    localStorage.setItem(
      this._storageKey + '.tabIndex',
      this.tabIndex.toString()
    );
  }

  onSelect(event: Compra[]) {
    const selected = event.map(item => item.id);
    this.store.dispatch(new fromActions.SetSelectedCompras({ selected }));

    event.map(item => {
      if (!item.partidas) {
        this.store.dispatch(new fromActions.GetCompra({ id: item.id }));
      }
    });
  }

  onSearch(event: string) {
    this.store.dispatch(new fromActions.SetSearchTerm(event));
  }

  getSucursales(object): string[] {
    return _.keys(object);
  }

  onEdit(event: Compra) {
    this.store.dispatch(new fromRoot.Go({ path: [event.id] }));
  }
}
