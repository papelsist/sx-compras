import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromRecepciones from '../../store/recepciones.selectors';
import * as fromActions from '../../store/recepciones.actions';

import { Observable, BehaviorSubject } from 'rxjs';

import { RecepcionDeCompra, ComsFilter } from '../../models/recepcionDeCompra';

@Component({
  selector: 'sx-recepciones',
  templateUrl: './recepciones.component.html'
})
export class RecepcionesComponent implements OnInit {
  coms$: Observable<RecepcionDeCompra[]>;

  search$ = new BehaviorSubject<string>('');
  comsFilter$: Observable<ComsFilter>;

  private _storageKey = 'sx-compras.coms';

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.coms$ = this.store.pipe(select(fromRecepciones.getAllRecepciones));
    this.comsFilter$ = this.store.pipe(
      select(fromRecepciones.getRecepcionesFilter)
    );

    const lastSearch = localStorage.getItem(this._storageKey + '.filter');

    if (lastSearch) {
      this.search$.next(lastSearch);
    }
  }

  onSelect(event: RecepcionDeCompra[]) {}

  onSearch(event: string) {
    this.search$.next(event);
    localStorage.setItem(this._storageKey + '.filter', event);
  }

  onFilter(filter: ComsFilter) {
    this.store.dispatch(new fromActions.SetRecepcionesFilter({ filter }));
  }
}
