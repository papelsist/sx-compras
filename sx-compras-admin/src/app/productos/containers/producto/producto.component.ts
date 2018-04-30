import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../store';
import { Producto } from '../../models/producto';

@Component({
  selector: 'sx-producto',
  template: `
    <p>
      producto works!
    </p>
    <section>
      {{ (producto$ | async) | json }}
    </section>
  `,
  styles: [],
})
export class ProductoComponent implements OnInit {
  producto$: Observable<Producto>;

  constructor(private store: Store<fromStore.CatalogosState>) {}

  ngOnInit() {
    this.producto$ = this.store.select(fromStore.getSelectedProducto);
    this.store.dispatch(new fromStore.LoadLineas());
  }
}
