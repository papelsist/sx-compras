import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Analisis, CuentaPorPagar, RecepcionDeCompra } from '../../model';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-analisis-edit',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div>
      <sx-analisis-edit-form
        [analisis]="analisis$ | async"
        [comsDisponibles]="coms$ | async"
        (cancel)="onCancel()"
        (update)="onUpdate($event)"
        (delete)="onDelete($event)"
        (cerrar)="onCerrar($event)">
      </sx-analisis-edit-form>
    </div>
  </ng-template>
  `
})
export class AnalisisEditComponent implements OnInit, OnDestroy {
  analisis$: Observable<Analisis>;
  factura$: Observable<CuentaPorPagar>;
  coms$: Observable<RecepcionDeCompra[]>;
  loading$: Observable<boolean>;

  subscription: Subscription;

  constructor(
    private store: Store<fromStore.CxpState>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.analisis$ = this.store.select(fromStore.getSelectedAnalisis);
    this.factura$ = this.analisis$.pipe(pluck('factura'));
    this.loading$ = this.store.select(fromStore.getLoading);
    this.coms$ = this.store.select(fromStore.getAllComsPendientes);

    this.subscription = this.analisis$.subscribe(analisis => {
      if (analisis && !analisis.cerrado) {
        this.store.dispatch(
          new fromStore.LoadComsPendientes(analisis.proveedor)
        );
      }
    });
  }

  ngOnDestroy() {
    // this.subscriptions.forEach(item => item.unsubscribe());
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/analisis'] }));
  }

  onUpdate(event: Analisis) {
    // console.log('Acutalizando analisis: ', event);
    this.store.dispatch(new fromStore.UpdateAnalisis(event));
  }

  onDelete(event: Analisis) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar análisis',
        message: `Análisis ${event.folio}`,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.DeleteAnalisis(event));
        }
      });
  }

  onCerrar(event: Analisis) {
    if (!event.cerrado) {
      this.dialogService
        .openConfirm({
          title: `Cerrar Análisis ${event.folio}`,
          message: `ADVERTENCIA: Ya no sera posible modificarlo!`,
          acceptButton: 'Cerrar',
          cancelButton: 'Cancelar'
        })
        .afterClosed()
        .subscribe(res => {
          if (res) {
            this.store.dispatch(new fromStore.CerrarAnalisis(event));
          }
        });
    }
  }
}
