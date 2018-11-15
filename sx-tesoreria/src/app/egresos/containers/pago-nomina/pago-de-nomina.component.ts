import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/pago-nomina.actions';

import { PagoDeNomina, CancelacionDeCheque } from '../../models';
import { MatDialog } from '@angular/material';
import { PagoDeNominaDialogComponent } from 'app/egresos/components';

@Component({
  selector: 'sx-pago-nomina',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div *ngIf="pagoDeNomina$ | async as pago">
      <sx-pago-nomina-form
        [pagoNomina]="pago"
        (cancel)="onCancel()">
        <button mat-button  (click)="onPagar(pago)" color="primary" *ngIf="!pago.egreso">
            <mat-icon >attach_money</mat-icon> Pagar
        </button>
        <sx-print-cheque [egreso]="pago.egreso" ></sx-print-cheque>
        <sx-poliza-cheque [egreso]="pago.egreso"></sx-poliza-cheque>
        <!--
        <sx-cancelar-pago [pago]="pago" (cancelar)="onCancelarPago($event)"></sx-cancelar-pago>
        <sx-generar-cheque-btn [pago]="pago" (generar)="onGenerarCheque($event)"></sx-generar-cheque-btn>
        <sx-cancelar-cheque [pago]="pago" (cancelar)="onCancelarCheque($event)"></sx-cancelar-cheque>
        -->
      </sx-pago-nomina-form>
    </div>
  </ng-template>
  `
})
export class PagoDeNominaComponent implements OnInit {
  pagoDeNomina$: Observable<PagoDeNomina>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.pagoDeNomina$ = this.store.pipe(
      select(fromStore.getSelectedPagoDeNomina)
    );
    this.loading$ = this.store.select(fromStore.getPagoDeNominasLoading);
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Back());
  }

  onPagar(event: PagoDeNomina) {
    this.dialog
      .open(PagoDeNominaDialogComponent, {
        data: { pago: event },
        width: '750px'
      })
      .afterClosed()
      .subscribe(pago => {
        if (pago) {
          this.store.dispatch(new fromActions.PagarNomina({ command: pago }));
        }
      });
  }

  onCancelarPago(event: PagoDeNomina) {}

  onCancelarCheque(cancelacion: CancelacionDeCheque) {
    this.store.dispatch(new fromStore.CancelarCheque({ cancelacion }));
  }

  onGenerarCheque(pago: PagoDeNomina) {
    // this.store.dispatch(new fromStore.GenerarCheque({ pago }));
  }
}
