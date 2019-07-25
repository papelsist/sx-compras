import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromRecepciones from '../../store/recepciones.selectors';

import { Observable } from 'rxjs';

import { RecepcionDeCompra } from '../../models';

@Component({
  selector: 'sx-recepcion-com',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecepcionComponent implements OnInit {
  loading$: Observable<boolean>;
  recepcion$: Observable<RecepcionDeCompra>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(fromRecepciones.getRecepcionesLoading)
    );

    this.recepcion$ = this.store.pipe(
      select(fromRecepciones.getSelectedRecepcionDeCompra)
    );
  }

  back() {
    this.store.dispatch(new fromRoot.Back());
  }

  onPrint(event: Partial<RecepcionDeCompra>) {}
}
