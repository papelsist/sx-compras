import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Requisicion, CuentaPorPagar } from '../../model';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-requisicion',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div>
      <sx-requisicion-form
        [requisicion]="requisicion$ | async"
        (cancel)="onCancel()"
        (save)="onSave($event)"
        (update)="onUpdate($event)"
        (delete)="onDelete($event)"
        (cerrar)="onCerrar($event)"
        (proveedor)="onProveedor($event)"
        [facturas]="facturasPendientes$ | async">
      </sx-requisicion-form>
    </div>
  </ng-template>
  `
})
export class RequisicionComponent implements OnInit, OnDestroy {
  requisicion$: Observable<Requisicion>;
  facturasPendientes$: Observable<CuentaPorPagar[]>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(
    private store: Store<fromStore.CxpState>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.requisicion$ = this.store.pipe(
      select(fromStore.getSelectedRequisicion)
    );
    this.subscription = this.requisicion$.subscribe(requisicion => {
      if (requisicion && !requisicion.cerrada) {
        this.onProveedor(requisicion.proveedor);
      }
    });
    this.facturasPendientes$ = this.store.pipe(
      select(fromStore.getAllFacturasPorRequisitar)
    );
    this.loading$ = this.store.select(fromStore.getRequisicionFormLoading);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onProveedor(event: any) {
    this.store.dispatch(new fromStore.LoadFacturasPorRequisitar(event.id));
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/requisiciones'] }));
  }

  onSave(event: Requisicion) {
    this.store.dispatch(new fromStore.SaveRequisicion(event));
  }

  onUpdate(event: Requisicion) {
    this.store.dispatch(new fromStore.UpdateRequisicion(event));
  }

  onDelete(event: Requisicion) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar requisición',
        message: `Folio: ${event.folio}`,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.DeleteRequisicion(event));
        }
      });
  }

  onCerrar(event: Requisicion) {
    if (!event.cerrada) {
      this.dialogService
        .openConfirm({
          title: `Cerrar Requisición ${event.folio}`,
          message: `ADVERTENCIA: Ya no sera posible revertir el cambio!`,
          acceptButton: 'Cerrar',
          cancelButton: 'Cancelar'
        })
        .afterClosed()
        .subscribe(res => {
          if (res) {
            this.store.dispatch(new fromStore.CerrarRequisicion(event));
          }
        });
    }
  }
}
