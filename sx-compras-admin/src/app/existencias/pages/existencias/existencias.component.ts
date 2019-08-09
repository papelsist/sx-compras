import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { Update } from '@ngrx/entity';

import { Observable } from 'rxjs';

import { Periodo } from 'app/_core/models/periodo';
import { Existencia } from 'app/existencias/models';

@Component({
  selector: 'sx-existencias',
  templateUrl: './existencias.component.html',
  styleUrls: ['./existencias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExistenciasComponent implements OnInit {
  periodo$: Observable<Periodo>;
  rows$: Observable<Existencia[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.periodo$ = this.store.pipe(select(fromStore.selectPeriodo));
    this.loading$ = this.store.pipe(select(fromStore.selectExistenciasLoading));
    this.rows$ = this.store.pipe(select(fromStore.getAllExistencias));
  }

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromStore.SetPeriodo({ periodo: event }));
  }

  onReload() {
    this.store.dispatch(new fromStore.LoadExistencias());
  }

  onSelect(event: Partial<Existencia>) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['inventarios/existencias', event.id] })
    );
  }
}
