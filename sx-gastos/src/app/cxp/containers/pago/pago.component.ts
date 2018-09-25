import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/pagos.actions';

import { Observable } from 'rxjs';

import { TdDialogService } from '@covalent/core';

import { Pago } from '../../model';

@Component({
  selector: 'sx-pago',
  template: `
    <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
      <div>
        <sx-pago-form [pago]="pago$ | async"
          (save)="onSave($event)"
          (delete)="onDelete($event)"
          (aplicar)="onAplicar($event)">
        </sx-pago-form>
      </div>
    </ng-template>
  `
})
export class PagoComponent implements OnInit, OnDestroy {
  pago$: Observable<Pago>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.pago$ = this.store.pipe(select(fromStore.getSelectedPago));
    this.loading$ = this.store.pipe(select(fromStore.getPagosLoading));
  }

  ngOnDestroy() {}

  onSave(event: Pago) {
    this.store.dispatch(new fromActions.UpdatePago(event));
  }

  onDelete(event: Pago) {
    this.store.dispatch(new fromActions.DeletePago(event));
  }

  onAplicar(event: Pago) {
    this.dialogService
      .openConfirm({
        message: `Disponible $ ${event.disponible} ${event.moneda}`,
        title: `Aplicar pagos de la requisición: ${event.folio}`,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromActions.AplicarPago(event));
        }
      });
  }
}
