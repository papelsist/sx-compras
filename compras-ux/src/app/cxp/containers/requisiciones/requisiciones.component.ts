import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable, BehaviorSubject } from 'rxjs';

import { Periodo } from 'app/_core/models/periodo';
import { Requisicion } from '../../model';

@Component({
  selector: 'sx-cxp-requisiciones',
  templateUrl: './requisiciones.component.html',
  styleUrls: ['./requisiciones.component.scss']
})
export class RequisicionesComponent implements OnInit {
  requisiciones$: Observable<Requisicion[]>;
  periodo$: Observable<Periodo>;

  loading$: Observable<boolean>;
  totales: any = {};

  constructor(private store: Store<fromStore.CxpState>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getRequisicionesLoading));
    this.periodo$ = this.store.pipe(
      select(fromStore.getPeriodoDeRequisiciones)
    );
    this.requisiciones$ = this.store.pipe(
      select(fromStore.getAllRequisiciones)
    );
  }

  reload() {
    this.store.dispatch(new fromStore.LoadRequisiciones());
  }

  cambiarPeriodo(event: Periodo) {
    if (event) {
      this.store.dispatch(
        new fromStore.SetRequisicionPeriodo({ periodo: event })
      );
    }
  }

  onCreate() {
    this.store.dispatch(
      new fromRoot.Go({ path: ['cxp/requisiciones/create'] })
    );
  }

  onSelect(event: Requisicion) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['cxp/requisiciones', event.id] })
    );
  }

  onPrint(event: Requisicion) {}

  onTotales(event) {
    this.totales = event;
  }
}
