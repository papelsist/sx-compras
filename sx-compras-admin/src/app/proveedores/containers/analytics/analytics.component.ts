import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions';

import { Observable } from 'rxjs';

import { Proveedor } from '../../models/proveedor';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'sx-proveedor-analytics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  proveedor$: Observable<Proveedor>;
  constructor(private store: Store<fromStore.ProveedoresState>) {}

  ngOnInit() {
    this.proveedor$ = this.store.pipe(select(fromStore.getSelectedProveedor));
  }

  onSave(event: Update<Proveedor>) {
    if (event.id) {
      this.store.dispatch(new fromActions.UpdateProveedor({ update: event }));
    }
  }

  onCancel(event) {
    this.store.dispatch(new fromRoot.Go({ path: ['/proveedores'] }));
  }
}
