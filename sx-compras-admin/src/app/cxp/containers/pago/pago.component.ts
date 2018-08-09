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
    <div>
      <!--
      <sx-nota-form [nota]="nota"
        (save)="onSave($event)"
        (delete)="onDelete($event)"
        (aplicar)="onAplicar($event)">
      </sx-nota-form>
      -->
    </div>
  `
})
export class PagoComponent implements OnInit, OnDestroy {
  pago$: Observable<Pago>;

  constructor(
    private store: Store<fromStore.CxpState>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.pago$ = this.store.pipe(select(fromStore.getSelectedPago));
  }

  ngOnDestroy() {}

  onSave(event: Pago) {
    this.store.dispatch(new fromActions.UpdatePago(event));
  }

  onDelete(event: Pago) {
    this.store.dispatch(new fromActions.DeletePago(event));
  }
  onCerrar(event: Pago) {
    console.log('Cerrar: ', event);
  }

  onAplicar(event: Pago) {
    this.dialogService
      .openConfirm({
        message: `Disponible $ ${event.disponible} `,
        title: 'Aplicar pago',
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
