import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';
import { Update } from '@ngrx/entity';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material';

import { TdDialogService } from '@covalent/core';

import { Periodo } from 'app/_core/models/periodo';
import { Recibo } from '../models';
import { ReciboService } from '../services/recibo.service';

@Component({
  selector: 'sx-recibos-page',
  templateUrl: './recibos-page.component.html',
  styleUrls: ['./recibos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecibosPageComponent implements OnInit {
  periodo$: Observable<Periodo>;
  rows$: Observable<Recibo[]>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private service: ReciboService
  ) {}

  ngOnInit() {
    this.periodo$ = this.store.pipe(select(fromStore.selectPeriodo));
    this.loading$ = this.store.pipe(select(fromStore.selectRecibosLoading));
    this.rows$ = this.store.pipe(select(fromStore.getAllRecibos));
  }

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromStore.SetPeriodo({ periodo: event }));
  }

  onReload() {
    this.store.dispatch(new fromStore.LoadRecibos());
  }

  onSelect(event: Partial<Recibo>) {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/recibos', event.id] }));
  }

  onXml(event: Partial<Recibo>) {
    this.service.mostrarXml(event).subscribe(res => {
      const blob = new Blob([res], {
        type: 'text/xml'
      });
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }
}
