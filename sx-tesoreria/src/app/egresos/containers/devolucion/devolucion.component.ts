import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/devolucion-cliente.actions';

import { DevolucionCliente } from '../../models';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-devolucion',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div layout>
      <sx-devolucion-form flex="70"
        [devolucion]="devolucion$ | async"
        (save)="onSave($event)"
        (cancelar)="onCancel()"
        (delete)="onDelete($event)">
        <ng-container *ngIf="devolucion$ | async as devolucion">
          <sx-print-cheque [egreso]="devolucion.egreso"></sx-print-cheque>
          <sx-poliza-cheque [egreso]="devolucion.egreso" ></sx-poliza-cheque>
        </ng-container>

      </sx-devolucion-form>
    </div>
  </ng-template>
  `
})
export class DevolucionComponent implements OnInit {
  devolucion$: Observable<DevolucionCliente>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(
    private store: Store<fromStore.State>,
    private _dialogService: TdDialogService
  ) {}

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

  onDelete(event: DevolucionCliente) {
    this._dialogService
      .openConfirm({
        title: `Eliminación de devolución del cliente`,
        message: `Folio: ${event.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeleteDevolucionCliente({ devolucion: event })
          );
        }
      });
  }
}
