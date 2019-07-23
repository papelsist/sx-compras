import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Periodo } from 'app/_core/models/periodo';
import { RequisicionDeMaterial } from 'app/requisiciones/models';
import { MatDialog } from '@angular/material';
import { RequisicionCreateComponent } from 'app/requisiciones/components/requisicion-create/requisicion-create.component';

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
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.periodo$ = this.store.pipe(select(fromStore.selectPeriodo));
    this.loading$ = this.store.pipe(
      select(fromStore.selectRequisicionesLoading)
    );
  }

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromStore.SetPeriodo({ periodo: event }));
  }

  onReload() {}

  onCreate() {
    this.dialog
      .open(RequisicionCreateComponent, { data: {}, width: '650px' })
      .afterClosed()
      .subscribe(res =>
        this.store.dispatch(
          new fromStore.CreateRequisicionDeMaterial({ requisicion: res })
        )
      );
  }
  onSelect(event: RequisicionDeMaterial) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['/requisiciones', event.id] })
    );
  }
}
