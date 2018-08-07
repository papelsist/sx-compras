import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/compra.actions';

import { Observable } from 'rxjs';

import { Compra } from '../../models/compra';

@Injectable()
export class CompraUiService {
  compra$: Observable<Compra>;
  constructor(private store: Store<fromStore.State>) {
    this.compra$ = this.store.pipe(select(fromStore.getSelectedCompra));
  }

  depurar(compra: Compra) {
    console.log('Depurar compra: ', compra);
  }

  cerrar(compra: Compra) {
    this.store.dispatch(new fromActions.CerrarCompra(compra));
  }
}
