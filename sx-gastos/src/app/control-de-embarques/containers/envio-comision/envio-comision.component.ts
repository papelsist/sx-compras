import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { EnvioComision } from '../../model';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-envio-comision',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <div>
    <!--
      <sx-rembolso-form
        [rembolso]="envio$ | async"
        (cancel)="onCancel()"
        (save)="onSave($event)"
        (delete)="onDelete($event)">
      </sx-rembolso-form>
    -->
    </div>
  </ng-template>
  `
})
export class EnvioComisionComponent implements OnInit, OnDestroy {
  envio$: Observable<EnvioComision>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.envio$ = this.store.pipe(select(fromStore.getSelectedEnvioComision));
    this.loading$ = this.store.pipe(select(fromStore.getEnvioComisionLoading));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/rembolsos'] }));
  }

  onSave(event: EnvioComision) {
    const update = { id: event.id, changes: event };
    console.log('Update: ', update);
    // this.store.dispatch(new fromStore.UpdateRembolso({ rembolso: update }));
  }

  onDelete(event: EnvioComision) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar comision',
        message: `Folio: ${event.id}`,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          /*
          this.store.dispatch(
            new fromStore.DeleteRembolso({ rembolso: event })
          );
          */
        }
      });
  }
}
