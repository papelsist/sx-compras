import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Requisicion, CuentaPorPagar } from '../../models';

import { TdDialogService } from '@covalent/core';
import { PagoDeRequisicion } from '../../models/pagoDeRequisicion';

@Component({
  selector: 'sx-requisicion',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div>
      <sx-requisicion-pago
        [requisicion]="requisicion$ | async"
        (cancel)="onCancel()"
        (pagar)="onPagar($event)">
      </sx-requisicion-pago>
    </div>
  </ng-template>
  `
})
export class GastoComponent implements OnInit {
  requisicion$: Observable<Requisicion>;
  facturasPendientes$: Observable<CuentaPorPagar[]>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.requisicion$ = this.store.pipe(select(fromStore.getSelectedGasto));
    this.loading$ = this.store.select(fromStore.getGastosLoading);
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Go({ path: ['egresos/gastos'] }));
  }

  onPagar(pago: PagoDeRequisicion) {
    this.store.dispatch(new fromStore.PagarGasto({ pago }));
  }

  onCancelarPago(event: Requisicion) {
    this.dialogService
      .openConfirm({
        title: 'Cancelar el pago de la requisición',
        message: `Folio: ${event.folio}`,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          // this.store.dispatch(new fromStore.DeleteRequisicion(event));
        }
      });
  }
}
