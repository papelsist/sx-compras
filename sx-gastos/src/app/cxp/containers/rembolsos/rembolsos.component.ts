import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Rembolso, RembolsosFilter } from '../../model';
import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-rembolsos',
  templateUrl: './rembolsos.component.html',
  styleUrls: ['./rembolsos.component.scss']
})
export class RembolsosComponent implements OnInit {
  rembolsos$: Observable<Rembolso[]>;
  loading$: Observable<boolean>;
  periodo$: Observable<Periodo>;
  filter$: Observable<RembolsosFilter>;
  search = '';

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.periodo$ = this.store.pipe(select(fromStore.selectPeriodoDeRembolsos));
    this.loading$ = this.store.pipe(select(fromStore.getRembolsosLoading));
    this.rembolsos$ = this.store.pipe(select(fromStore.getAllRembolsos));
    this.filter$ = this.store.pipe(select(fromStore.getRembolsosFilter));
  }

  onCreate() {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/rembolsos/create'] }));
  }

  onSelect(event: Rembolso) {
    this.onEdit(event);
  }

  onPeriodo(periodo: Periodo) {
    this.store.dispatch(new fromStore.SetRembolsosPeriodo({ periodo }));
  }

  onFilter(filter: RembolsosFilter) {
    this.store.dispatch(new fromStore.SetRembolsosFilter({ filter }));
  }

  onEdit(event: Rembolso) {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/rembolsos', event.id] }));
  }

  onPrint(event: Rembolso) {}

  reload() {
    this.store.dispatch(new fromStore.LoadRembolsos());
  }
}
