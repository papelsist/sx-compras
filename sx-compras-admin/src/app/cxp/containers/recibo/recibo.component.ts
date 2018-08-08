import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/contrarecibos.actions';

import { Observable, of } from 'rxjs';
import {
  startWith,
  switchMap,
  catchError,
  filter,
  withLatestFrom,
  tap
} from 'rxjs/operators';

import { TdDialogService } from '@covalent/core';

import { Contrarecibo, CuentaPorPagar } from '../../model';
import { ContrareciboService } from '../../services';

@Component({
  selector: 'sx-recibo',
  template: `
    <div>
      <sx-recibo-form [recibo]="recibo$ | async"
        (save)="onSave($event)"
        (delete)="onDelete($event)"
        [facturas]="facturasPendientes$ | async">
      </sx-recibo-form>
    </div>
  `
})
export class ReciboComponent implements OnInit, OnDestroy {
  recibo$: Observable<Contrarecibo>;
  facturasPendientes$: Observable<CuentaPorPagar[]>;

  constructor(
    private store: Store<fromStore.CxpState>,
    private service: ContrareciboService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.recibo$ = this.store.pipe(select(fromStore.getSelectedContrarecibo));
    this.facturasPendientes$ = this.recibo$.pipe(
      filter(res => !!res),
      // tap(res => console.log('Contrarecibo: ', res)),
      switchMap(recibo => {
        return this.service.pendientes(recibo.proveedor.id);
      })
    );
  }

  ngOnDestroy() {}

  onSave(event: Contrarecibo) {
    if (event.id) {
      this.store.dispatch(new fromActions.UpdateContrarecibo(event));
    } else {
      this.store.dispatch(new fromActions.AddContrarecibo(event));
    }
  }

  onDelete(event: Contrarecibo) {
    this.dialogService
      .openConfirm({
        message: `Folio ${event.id}`,
        title: 'Eliminar contrarecibo?',
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromActions.DeleteContrarecibo(event));
        }
      });
  }
}
