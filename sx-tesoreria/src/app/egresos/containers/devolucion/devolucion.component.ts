import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/devolucion-cliente.actions';

import { DevolucionCliente } from '../../models';

@Component({
  selector: 'sx-devolucion',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div layout>
      <sx-devolucion-form flex="50"
        [devolucion]="devolucion$ | async"
        (save)="onSave($event)"
        (cancel)="onCancel($event)">
        <!--
        <sx-cancelar-pago [requisicion]="requisicion" (cancelar)="onCancelarPago($event)"></sx-cancelar-pago>
        <sx-generar-cheque-btn [requisicion]="requisicion" (generar)="onGenerarCheque($event)"></sx-generar-cheque-btn>
        <sx-cancelar-cheque [requisicion]="requisicion" (cancelar)="onCancelarCheque($event)"></sx-cancelar-cheque>
        <sx-print-cheque [egreso]="requisicion.egreso"></sx-print-cheque>
        <sx-poliza-cheque [egreso]="requisicion.egreso"></sx-poliza-cheque>
        -->
      </sx-devolucion-form>
    </div>
  </ng-template>
  `
})
export class DevolucionComponent implements OnInit {
  devolucion$: Observable<DevolucionCliente>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.devolucion$ = this.store.pipe(
      select(fromStore.getSelectedDevolucionCliente)
    );
    this.loading$ = this.store.select(fromStore.getDevolucionClienteLoading);
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Back());
  }

  onSave(devolucion: DevolucionCliente) {
    this.store.dispatch(
      new fromActions.CreateDevolucionCliente({ devolucion })
    );
  }

  onCancelarPago(event: DevolucionCliente) {
    this.store.dispatch(
      new fromActions.DeleteDevolucionCliente({ devolucion: event })
    );
  }
  /*
  onCancelarCheque(cancelacion: CancelacionDeCheque) {
    this.store.dispatch(new fromStore.CancelarCheque({ cancelacion }));
  }
  */

  onGenerarCheque(devolucion: DevolucionCliente) {
    // this.store.dispatch(new fromStore.GenerarCheque({ requisicion }));
  }
}
