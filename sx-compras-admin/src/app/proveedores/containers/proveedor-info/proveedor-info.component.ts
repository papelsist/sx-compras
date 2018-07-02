import { Component, OnInit, Input } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Proveedor } from '../../models/proveedor';

@Component({
  selector: 'sx-proveedor-info',
  template: `
    <div >
      <sx-proveedor-form [proveedor]="proveedor$ | async">
      </sx-proveedor-form>
    </div>
  `
})
export class ProveedorInfoComponent implements OnInit {
  proveedor$: Observable<Proveedor>;
  constructor(private store: Store<fromStore.ProveedoresState>) {}

  ngOnInit() {
    this.proveedor$ = this.store.pipe(select(fromStore.getCurrentProveedor));
  }
}
