import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/compra.actions';

import { Observable } from 'rxjs';
import { Compra } from '../../models/compra';
import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-compras',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit, OnDestroy {
  compras$: Observable<Compra[]>;
  periodo$: Observable<Periodo>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getComprasLoading));
    this.compras$ = this.store.pipe(select(fromStore.getAllCompras));
  }

  ngOnDestroy() {}

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromActions.SetPeriodo({ periodo: event }));
  }

  reload() {
    this.store.dispatch(new fromActions.LoadCompras());
  }

  onCreate() {
    this.store.dispatch(new fromRoot.Go({ path: ['ordenes/compras/create'] }));
  }

  onSelect(event: Compra) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['ordenes/compras', event.id] })
    );
  }
}
