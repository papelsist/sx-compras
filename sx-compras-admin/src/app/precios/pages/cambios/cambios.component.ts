import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Periodo } from 'app/_core/models/periodo';
import { CambioDePrecio } from '../../models';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'sx-cambios',
  templateUrl: './cambios.component.html',
  styleUrls: ['./cambios.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CambiosComponent implements OnInit {
  periodo$: Observable<Periodo>;
  rows$: Observable<CambioDePrecio[]>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.periodo$ = this.store.pipe(select(fromStore.selectPeriodo));
    this.loading$ = this.store.pipe(select(fromStore.selectCambiosLoading));
    this.rows$ = this.store.pipe(select(fromStore.getAllCambios));
  }

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromStore.SetPeriodo({ periodo: event }));
  }

  onReload() {
    this.store.dispatch(new fromStore.LoadCambiosDePrecio());
  }

  onCreate() {
    /*
    this.dialog
      .open(RequisicionCreateComponent, { data: {}, width: '650px' })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromStore.CreateCambioDePrecio({ requisicion: res })
          );
        }
      });
      */
  }
  onSelect(event: CambioDePrecio) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['cambios-de-precio', event.id] })
    );
  }
}
