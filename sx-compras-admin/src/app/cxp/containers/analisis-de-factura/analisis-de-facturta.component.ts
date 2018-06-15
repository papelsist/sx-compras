import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { Store } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/analisis.actions';

import { Proveedor } from 'app/proveedores/models/proveedor';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';
import { Analisis } from '../../model/analisis';

@Component({
  selector: 'sx-analisis-de-factura',
  template: `
    <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
      <sx-analisis-form
        (proveedorSelected)="onProveedorSelected($event)"
        [facturas]="facturas$ | async"
        (cancelar)="onCancelar($event)"
        (save)="onSave($event)">
      </sx-analisis-form>
    </ng-template>
  `
})
export class AnalisisDeFacturaComponent implements OnInit, OnDestroy {
  facturas$: Observable<CuentaPorPagar[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.CxpState>) {}

  ngOnInit() {
    this.facturas$ = this.store.select(fromStore.getAllFacturasPendientes);
    this.loading$ = this.store.select(fromStore.getLoading);
  }

  ngOnDestroy() {}

  onProveedorSelected(event: Proveedor) {
    this.store.dispatch(new fromActions.SetCurrentProveedor(event));
  }

  onCancelar(event) {
    this.store.dispatch(new fromRoot.Back());
  }

  onSave(event: Analisis) {
    this.store.dispatch(new fromActions.SaveAnalisis(event));
  }
}
