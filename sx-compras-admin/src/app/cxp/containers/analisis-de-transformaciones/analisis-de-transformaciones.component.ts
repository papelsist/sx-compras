import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/analisis-de-transformacion.actions';

import { Observable } from 'rxjs';

import { AnalisisDeTransformacion } from '../../model';

import * as _ from 'lodash';
import { Periodo } from '../../../_core/models/periodo';
import { MatDialog } from '@angular/material';
import { AnalisisTrsDialogComponent } from 'app/cxp/components';
import { PeriodoDialogComponent } from 'app/_shared/components';

@Component({
  selector: 'sx-analisis-de-transformaciones',
  templateUrl: './analisis-de-transformaciones.component.html',
  styleUrls: ['./analisis-de-transformaciones.component.scss']
})
export class AnalisisDeTransformacionesComponent implements OnInit {
  loading$: Observable<boolean>;
  analisis$: Observable<AnalisisDeTransformacion[]>;
  totales$: Observable<any>;
  periodo: Periodo;

  constructor(
    private store: Store<fromStore.CxpState>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.periodo = Periodo.fromNow(100);
    this.loading$ = this.store.pipe(
      select(fromStore.selectAnalisisDeTransformacionLoading)
    );
    this.analisis$ = this.store.pipe(
      select(fromStore.selectAnalisisDeTransformacion)
    );
    this.reload();

    this.totales$ = this.store.pipe(select(fromStore.selectTotalDeAnalisis));
  }

  onCreate() {
    this.dialog
      .open(AnalisisTrsDialogComponent, { data: {}, width: '650px' })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.CreateAnalisisDeTransformacion({ analisis: res })
          );
        }
      });
  }

  onSelect(event: AnalisisDeTransformacion) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['cxp/analisisDeTrs/', event.id] })
    );
  }

  reload() {
    this.store.dispatch(
      new fromActions.LoadAnalisisDeTransformaciones({ periodo: this.periodo })
    );
  }

  onPeriodo(event: Periodo) {
    this.periodo = event;
    this.reload();
  }

  onConsolidar(periodo: Periodo) {
    if (periodo) {
      this.store.dispatch(new fromActions.ConsolidarCostos({ periodo }));
    }
  }
}
