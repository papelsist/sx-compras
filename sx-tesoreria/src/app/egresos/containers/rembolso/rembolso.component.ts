import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Rembolso, PagoDeRembolso } from '../../models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-rembolso',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div *ngIf="rembolso$ | async as rembolso">
      <sx-rembolso-pago
        [rembolso]="rembolso"
        (cancel)="onCancel()">
        <button mat-button type="button" (click)="onCancel()">
          <mat-icon>arrow_back</mat-icon> Regresar
        </button>
        <sx-print-rembolso [rembolso]="rembolso" ></sx-print-rembolso>
        <sx-rembolso-pago-btn [rembolso]="rembolso" (pagar)="onPagar($event)"></sx-rembolso-pago-btn>
        <sx-cancelar-pago-rembolso [rembolso]="rembolso" (cancelar)="onCancelar($event)"></sx-cancelar-pago-rembolso>
        <sx-cancelar-cheque-rembolso [rembolso]="rembolso" (cancelar)="onCancelarCheque($event)"></sx-cancelar-cheque-rembolso>
        <sx-print-cheque [egreso]="rembolso.egreso"></sx-print-cheque>
        <sx-generar-cheque-rembolso-btn [rembolso]="rembolso" (generar)="onGenerarCheque($event)"></sx-generar-cheque-rembolso-btn>
      </sx-rembolso-pago>

    </div>
  </ng-template>
  `
})
export class RembolsoComponent implements OnInit, OnDestroy {
  rembolso$: Observable<Rembolso>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.rembolso$ = this.store.pipe(select(fromStore.getSelectedRembolso));
    this.loading$ = this.store.select(fromStore.getRembolsosLoading);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Go({ path: ['egresos/rembolsos'] }));
  }

  onPagar(event: PagoDeRembolso) {
    this.store.dispatch(new fromStore.PagoRembolso({ pago: event }));
  }

  onCancelar(event: Rembolso) {
    this.store.dispatch(
      new fromStore.CancelarPagoRembolso({ rembolso: event })
    );
  }

  onCancelarCheque(event: { id: number; comentario: string }) {
    this.store.dispatch(
      new fromStore.CancelarChequeRembolso({
        id: event.id,
        comentario: event.comentario
      })
    );
  }

  onGenerarCheque(rembolso: Rembolso) {
    this.store.dispatch(new fromStore.GenerarChequeRembolso({ rembolso }));
  }
}
