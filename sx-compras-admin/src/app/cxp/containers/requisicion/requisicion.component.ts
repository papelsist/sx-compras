import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Requisicion } from '../../model';

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
        (cerrar)="onCerrar($event)">
      </sx-requisicion-form>
    </div>
  </ng-template>
  `
})
export class RequisicionComponent implements OnInit, OnDestroy {
  requisicion$: Observable<Requisicion>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(
    private store: Store<fromStore.CxpState>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.requisicion$ = this.store.select(fromStore.getSelectedRequisicion);
    this.loading$ = this.store.select(fromStore.getRequisicionLoading);
  }

  ngOnDestroy() {}

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
          // this.store.dispatch(new fromStore.DeleteAnalisis(event));
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
            // this.store.dispatch(new fromStore.CerrarAnalisis(event));
          }
        });
    }
  }
}
