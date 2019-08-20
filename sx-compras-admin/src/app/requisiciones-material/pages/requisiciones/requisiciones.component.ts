import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Periodo } from 'app/_core/models/periodo';
import { RequisicionDeMaterial } from '../../models';
import { MatDialog } from '@angular/material';
import { RequisicionCreateComponent } from '../../components/requisicion-create/requisicion-create.component';
import { ReportService } from 'app/reportes/services/report.service';

@Component({
  selector: 'sx-requisiciones',
  templateUrl: './requisiciones.component.html',
  styleUrls: ['./requisiciones.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequisicionesComponent implements OnInit {
  periodo$: Observable<Periodo>;
  rows$: Observable<RequisicionDeMaterial[]>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.periodo$ = this.store.pipe(select(fromStore.selectPeriodo));
    this.loading$ = this.store.pipe(
      select(fromStore.selectRequisicionesLoading)
    );
    this.rows$ = this.store.pipe(select(fromStore.selectPendientes));
  }

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromStore.SetPeriodo({ periodo: event }));
  }

  onReload() {
    this.store.dispatch(new fromStore.LoadRequisicionesDeMaterial());
  }

  onCreate() {
    this.dialog
      .open(RequisicionCreateComponent, { data: {}, width: '650px' })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromStore.CreateRequisicionDeMaterial({ requisicion: res })
          );
        }
      });
  }
  onSelect(event: RequisicionDeMaterial) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['ordenes/requisiciones', event.id] })
    );
  }

  onPrint(row: Partial<RequisicionDeMaterial>) {
    const url = `requisicionDeMaterial/print/${row.id}`;
    this.reportService.runReport(url, {});
  }
}
