import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Requisicion, CuentaPorPagar } from '../../models';

import { TdDialogService } from '@covalent/core';
import { PagoDeRequisicion } from '../../models/pagoDeRequisicion';
import { ReportService } from '../../../reportes/services/report.service';

@Component({
  selector: 'sx-compra',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div>
      <sx-requisicion-pago
        [requisicion]="requisicion$ | async"
        (cancel)="onCancel()"
        (pagar)="onPagar($event)"
        (printCheque)="onPrintCheque($event)"
        (poliza)="onPoliza($event)">
      </sx-requisicion-pago>
    </div>
  </ng-template>
  `
})
export class CompraComponent implements OnInit {
  requisicion$: Observable<Requisicion>;
  facturasPendientes$: Observable<CuentaPorPagar[]>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.requisicion$ = this.store.pipe(select(fromStore.getSelectedCompra));
    this.loading$ = this.store.select(fromStore.getComprasLoading);
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Go({ path: ['egresos/compras'] }));
  }

  onPagar(pago: PagoDeRequisicion) {
    this.store.dispatch(new fromStore.PagarCompra({ pago }));
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

  onPrintCheque(egreso) {
    this.dialogService
      .openConfirm({
        title: 'Impresión de Cheque',
        message: 'Folio: ' + egreso.cheque.folio,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const cheque = { id: egreso.cheque.id };
          const url = `tesoreria/cheques/print/${cheque.id}`;
          this.reportService.runReport(url, {});
        }
      });
  }

  onPoliza(egreso) {
    if (egreso.cheque) {
      const cheque = { id: egreso.cheque.id };
      const url = `tesoreria/cheques/print/${cheque.id}`;
      this.reportService.runReport(url, {});
    }
  }
}
