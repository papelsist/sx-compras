import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/compra.actions';
import * as fromCompras from '../../store/selectors/compra.selectors';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Compra, ComprasFilter } from '../../models/compra';

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
  comprasFilter$: Observable<ComprasFilter>;

  search$ = new Subject();
  tabIndex = 2;
  private _storageKey = 'sx-compras.ordenes';
  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.comprasFilter$ = this.store.pipe(select(fromStore.getComprasFilter));

    this.comprasPorSucursal$ = this.store.pipe(
      select(fromStore.getComprasPorSucursalPendientes)
    );
    this.sucursales$ = this.comprasPorSucursal$.pipe(map(res => _.keys(res)));

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
    this.search$.next(event);
  }

  getSucursales(object): string[] {
    return _.keys(object);
  }

  onEdit(event: Compra) {
    this.store.dispatch(new fromRoot.Go({ path: [event.id] }));
  }

  onFilter(event: ComprasFilter) {
    this.store.dispatch(new fromActions.SetComprasFilter({ filter: event }));
  }
}
