import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Cartera, NotaDeCargo } from '../../models';

import { MatDialog } from '@angular/material';

import { CargosPorInteresesModalComponent } from 'app/cobranza/components';
import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-notas-de-cargo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notas-de-cargo.component.html',
  styles: [
    `
      .mat-card {
        width: calc(100% - 15px);
        height: calc(100% - 10px);
      }
    `
  ]
})
export class NotasDeCargoComponent implements OnInit {
  notas$: Observable<NotaDeCargo[]>;
  search$: Observable<string>;
  periodo: Periodo;
  cartera: Cartera = new Cartera('CHO', 'CHOFER');

  loading$: Observable<boolean>;

  storageKey = 'sx.cxp.choferes.notas-de-cargo';

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.periodo = Periodo.fromNow(90);
    this.loading$ = this.store.pipe(select(fromStore.getNotasDeCargoLoading));
    this.notas$ = this.store.pipe(select(fromStore.getAllNotasDeCargo));
    this.search$ = this.store.pipe(select(fromStore.getNotasDeCargoSearchTerm));
    this.reload();
  }

  onPeriodo(periodo: Periodo) {
    this.periodo = periodo;
    this.reload();
  }

  onSelect(event: NotaDeCargo) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['cobranza/notas-de-cargo', event.id] })
    );
  }

  reload() {
    this.store.dispatch(
      new fromStore.LoadNotasDeCargo({ periodo: this.periodo })
    );
  }

  generarNotasPorIntereses() {
    this.dialog
      .open(CargosPorInteresesModalComponent, { data: {}, width: '600px' })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.GenerarNotasPorIntereses(res));
        }
      });
  }
}
