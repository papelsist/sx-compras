import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Requisicion, CancelacionDeCheque } from '../../models';

import { PagoDeRequisicion } from '../../models/pagoDeRequisicion';

@Component({
  selector: 'sx-compra',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div *ngIf="requisicion$ | async as requisicion">
      <sx-pago-requisicion
        [requisicion]="requisicion"
        (cancel)="onCancel()">
        <sx-pago-requisicion-btn [requisicion]="requisicion" (pagar)="onPagar($event)"></sx-pago-requisicion-btn>
        <sx-cancelar-pago [requisicion]="requisicion" (cancelar)="onCancelarPago($event)"></sx-cancelar-pago>
        <sx-generar-cheque-btn [requisicion]="requisicion" (generar)="onGenerarCheque($event)"></sx-generar-cheque-btn>
        <sx-cancelar-cheque [requisicion]="requisicion" (cancelar)="onCancelarCheque($event)"></sx-cancelar-cheque>
        <sx-print-requisicion [requisicion]="requisicion"></sx-print-requisicion>
        <sx-print-cheque [egreso]="requisicion.egreso"></sx-print-cheque>
        <sx-poliza-cheque [egreso]="requisicion.egreso"></sx-poliza-cheque>
      </sx-pago-requisicion>
    </div>
  </ng-template>
  `
})
export class CompraComponent implements OnInit {
  requisicion$: Observable<Requisicion>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.requisicion$ = this.store.pipe(select(fromStore.getSelectedCompra));
    this.loading$ = this.store.select(fromStore.getComprasLoading);
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Back());
  }

  onPagar(pago: PagoDeRequisicion) {
    this.store.dispatch(new fromStore.PagarCompra({ pago }));
  }

  onCancelarPago(event: Requisicion) {
    this.store.dispatch(
      new fromStore.CancelarPagoRequisicion({ requisicion: event })
    );
  }

  onCancelarCheque(cancelacion: CancelacionDeCheque) {
    this.store.dispatch(new fromStore.CancelarCheque({ cancelacion }));
  }

  onGenerarCheque(event: { requisicion: Requisicion; referencia: string }) {
    this.store.dispatch(new fromStore.GenerarCheque(event));
  }
}
