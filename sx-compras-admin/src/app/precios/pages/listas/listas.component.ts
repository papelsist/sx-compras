import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Periodo } from 'app/_core/models/periodo';
import { ListaDePreciosVenta } from '../../models';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'sx-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListasComponent implements OnInit {
  periodo$: Observable<Periodo>;
  rows$: Observable<ListaDePreciosVenta[]>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.periodo$ = this.store.pipe(select(fromStore.selectPeriodo));
    this.loading$ = this.store.pipe(select(fromStore.selectListasLoading));
    this.rows$ = this.store.pipe(select(fromStore.getAllListas));
  }

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromStore.SetPeriodo({ periodo: event }));
  }

  onReload() {
    this.store.dispatch(new fromStore.LoadListaDePrecios());
  }

  onCreate() {
    this.store.dispatch(new fromRoot.Go({ path: ['catalogos/listas/create'] }));
  }
  onSelect(event: ListaDePreciosVenta) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['catalogos/listas', event.id] })
    );
  }
}
