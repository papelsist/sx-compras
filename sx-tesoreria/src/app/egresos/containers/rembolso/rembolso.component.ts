import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Rembolso } from '../../models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-rembolso',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div>
      <sx-rembolso-pago
        [rembolso]="rembolso$ | async"
        (cancel)="onCancel()">
      </sx-rembolso-pago>

    </div>
  </ng-template>
  `
})
export class RembolsoComponent implements OnInit, OnDestroy {
  rembolso$: Observable<Rembolso>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.rembolso$ = this.store.pipe(select(fromStore.getSelectedRembolso));
    this.loading$ = this.store.select(fromStore.getRembolsosLoading);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/rembolsos'] }));
  }
}
