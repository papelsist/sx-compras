import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Rembolso } from '../../model';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-rembolso',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div>
      <sx-rembolso-form
        [rembolso]="rembolso$ | async"
        (cancel)="onCancel()"
        (save)="onSave($event)"
        (delete)="onDelete($event)">
      </sx-rembolso-form>

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

  onSave(event: Rembolso) {
    if (!event.id) {
      this.store.dispatch(new fromStore.SaveRembolso({ rembolso: event }));
    } else {
      const update = { id: event.id, changes: event };
      this.store.dispatch(new fromStore.UpdateRembolso({ rembolso: update }));
    }
  }

  onDelete(event: Rembolso) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar rembolso',
        message: `Folio: ${event.id}`,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromStore.DeleteRembolso({ rembolso: event })
          );
        }
      });
  }
}
