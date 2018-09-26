import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/recepcion.actions';

import { Observable } from 'rxjs';

import { RecepcionDeCompra } from '../../models/recepcionDeCompra';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-com-create',
  template: `
    <div>
      <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
        <sx-com-create-form (save)="onSave($event)">
        </sx-com-create-form>
      </ng-template>
    </div>
  `
})
export class ComCreateComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getComsLoading));
  }

  ngOnDestroy() {}

  onSave(event: RecepcionDeCompra) {
    this.store.dispatch(new fromActions.AddRecepcionDeCompra(event));
  }

  onDelete(event: RecepcionDeCompra) {
    this.store.dispatch(new fromActions.DeleteRecepcionDeCompra(event));
  }

  getPrintUrl(event: RecepcionDeCompra) {
    return `coms/print/${event.id}`;
  }
}
