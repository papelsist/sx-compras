import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Analisis } from '../../model/analisis';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';
import { Proveedor } from '../../../proveedores/models/proveedor';
import { RecepcionDeCompra } from '../../model/recepcionDeCompra';

@Component({
  selector: 'sx-analisis-edit',
  template: `
  <div>
    <sx-analisis-edit-form
      [analisis]="analisis$ | async"
      [comsDisponibles]="coms$ | async"
      (update)="onUpdate($event)">
    </sx-analisis-edit-form>
  </div>
  `
})
export class AnalisisEditComponent implements OnInit, OnDestroy {
  analisis$: Observable<Analisis>;
  factura$: Observable<CuentaPorPagar>;
  coms$: Observable<RecepcionDeCompra[]>;

  subscriptions: Subscription[] = [];
  constructor(
    private store: Store<fromStore.CxpState>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.analisis$ = this.store.select(fromStore.getSelectedAnalisis);
    this.factura$ = this.analisis$.pipe(pluck('factura'));
    this.coms$ = this.store.select(fromStore.getAllComsPendientes);

    this.subscriptions.push(
      this.analisis$
        .pipe(pluck('proveedor'))
        .subscribe((proveedor: Proveedor) => {
          this.store.dispatch(new fromStore.LoadComsPendientes(proveedor));
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  onCancelar() {
    this.store.dispatch(new fromRoot.Back());
  }

  onUpdate(event: Analisis) {
    console.log('Actualizar analisis: ', event);
    this.store.dispatch(new fromStore.UpdateAnalisis(event));
  }
}
