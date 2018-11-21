import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/pago-morralla.actions';

import { PagoDeMorralla } from '../../models';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-pago-morralla',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)"  tdLoadingStrategy="overlay" >
    <sx-pago-morralla-form [pago]="pago$ | async"
      (save)="onSave($event)"
      (cancelar)="onCancel($event)"
      (delete)="onDelete($event)">
    </sx-pago-morralla-form>
  </ng-template>
  `
})
export class PagoDeMorrallaComponent implements OnInit {
  pago$: Observable<PagoDeMorralla>;
  loading$: Observable<boolean>;
  subscription: Subscription;

  constructor(
    private store: Store<fromStore.State>,
    private _dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.pago$ = this.store.pipe(select(fromStore.getSelectedPagoDeMorralla));
    this.loading$ = this.store.select(fromStore.getPagoDeMorrallasLoading);
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Back());
  }

  onSave(event: PagoDeMorralla) {
    this.store.dispatch(new fromStore.CreatePagarMorralla({ pago: event }));
  }

  onDelete(event: PagoDeMorralla) {
    this._dialogService
      .openConfirm({
        title: `Eliminación de pago de morralla`,
        message: `Folio: ${event.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeletePagoDeMorralla({ pago: event })
          );
        }
      });
  }
}
