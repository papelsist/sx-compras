import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/recepcion.actions';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { RecepcionDeCompra, ComsFilter } from '../../models/recepcionDeCompra';
import { RecepcionDeCompraDet } from '../../models/recepcionDeCompraDet';

import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { ReportService } from '../../../reportes/services/report.service';
import { FechaDialogComponent } from '../../../_shared/components';

@Component({
  selector: 'sx-coms',
  templateUrl: './coms.component.html'
})
export class ComsComponent implements OnInit {
  coms$: Observable<RecepcionDeCompra[]>;
  partidas$: Observable<Partial<RecepcionDeCompraDet>[]>;
  search$ = new BehaviorSubject<string>('');
  comsFilter$: Observable<ComsFilter>;

  private _storageKey = 'sx-compras.coms';

  constructor(
    private store: Store<fromStore.State>,
    private reportService: ReportService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.coms$ = this.store.pipe(select(fromStore.getAllRecepcionesDeCompra));
    this.partidas$ = this.store.pipe(select(fromStore.getSelectedPartidas));
    this.comsFilter$ = this.store.pipe(select(fromStore.getComsFilter));

    const lastSearch = localStorage.getItem(this._storageKey + '.filter');

    if (lastSearch) {
      console.log('Last search: ', lastSearch);
      this.search$.next(lastSearch);
    }
  }

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
    localStorage.setItem(this._storageKey + '.filter', event);
  }

  onFilter(event: ComsFilter) {
    this.store.dispatch(new fromActions.SetComsFilter({ filter: event }));
  }

  recepcionesReport() {
    this.dialog
      .open(FechaDialogComponent, { data: {} })
      .afterClosed()
      .subscribe((res: Date) => {
        if (res) {
          const url = `coms/recepcionesPorDia`;
          console.log('Fecha en Iso STring');
          console.log(res.toISOString());
          this.reportService.runReport(url, { fecha: res.toISOString() });
        }
      });
  }

  reload() {
    this.store.dispatch(new fromActions.LoadComs());
  }
}
