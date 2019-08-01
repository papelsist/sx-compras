import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { ListaDePreciosVenta } from '../../models';
import { ProductoUtilsService } from 'app/productos/services/productos-utils.service';

@Component({
  selector: 'sx-lista-create',
  templateUrl: './lista-create.component.html',
  styleUrls: ['./lista-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaCreateComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.selectListasLoading));
  }

  onBack() {
    this.store.dispatch(new fromRoot.Back());
  }

  onSave(lista: ListaDePreciosVenta) {
    this.store.dispatch(new fromStore.CreateLista({ lista }));
  }
}
