import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/proveedores.actions';

import { Proveedor } from '../../models/proveedor';

@Component({
  selector: 'sx-proveedor-create',
  templateUrl: './proveedor-create.component.html'
})
export class ProveedorCreateComponent implements OnInit {
  constructor(private store: Store<fromStore.ProveedoresState>) {}

  ngOnInit() {}

  onSave(event: Proveedor) {
    this.store.dispatch(new fromActions.CreateProveedor(event));
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Go({ path: ['proveedores'] }));
  }
}
