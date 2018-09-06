import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/recepcion.actions';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { RecepcionDeCompra } from '../../models/recepcionDeCompra';
import { RecepcionDeCompraDet } from '../../models/recepcionDeCompraDet';

import * as _ from 'lodash';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'sx-coms',
  templateUrl: './coms.component.html'
})
export class ComsComponent implements OnInit, OnDestroy {
  coms$: Observable<RecepcionDeCompra[]>;
  partidas$: Observable<Partial<RecepcionDeCompraDet>[]>;
  search$ = new Subject<string>();

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.coms$ = this.store.pipe(select(fromStore.getAllRecepcionesDeCompra));
    this.partidas$ = this.store.pipe(select(fromStore.getSelectedPartidas));
  }

  ngOnDestroy() {}

  onSelect(event: RecepcionDeCompra[]) {
    const selected = event.map(item => item.id);
    this.store.dispatch(new fromActions.SetSelectedComs({ selected }));
    event.map(item => {
      if (!item.partidas) {
        this.store.dispatch(
          new fromActions.GetRecepcionDeCompra({ id: item.id })
        );
      }
    });
  }

  onSearch(event: string) {
    this.search$.next(event);
  }
}
