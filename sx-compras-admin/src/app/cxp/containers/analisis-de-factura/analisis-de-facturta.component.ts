import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/analisis.actions';

import { Proveedor } from 'app/proveedores/models/proveedor';

import { ComprobanteFiscal } from '../../model/comprobanteFiscal';

@Component({
  selector: 'sx-analisis-de-factura',
  template: `
    <sx-analisis-form (proveedorSelected)="onProveedorSelected($event)"></sx-analisis-form>
  `
})
export class AnalisisDeFacturaComponent implements OnInit, OnDestroy {
  facturasPendientes: ComprobanteFiscal[] = [];

  constructor(private store: Store<fromStore.CxpState>) {}

  ngOnInit() {}

  ngOnDestroy() {}

  onProveedorSelected(event: Proveedor) {
    this.store.dispatch(new fromActions.SetCurrentProveedor(event));
  }
}
