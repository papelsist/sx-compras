import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/recepcion.actions';

import { Observable } from 'rxjs';

import { RecepcionDeCompra } from '../../models/recepcionDeCompra';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-com',
  template: `
    <div>
      <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
        
        <sx-com-form [com]="com$ | async"
          (save)="onSave($event)">
          <ng-container *ngIf="com$ | async as com">
          <!--
            <sx-eliminar-compra [compra]="compra" (delete)="onDelete($event)"></sx-eliminar-compra>
            <sx-email-compra [compra]="compra"></sx-email-compra>
            <sx-cerrar-compra [compra]="compra" (cerrar)="onCerrar($event)"></sx-cerrar-compra>
            <sx-depurar-compra [compra]="compra" (deuprar)="onDepurar($event)"></sx-depurar-compra>
            <sx-compra-print [compra]="compra"></sx-compra-print>
          -->
          </ng-container>
        </sx-com-form>
       
      </ng-template>
    </div>
  `
})
export class ComComponent implements OnInit, OnDestroy {
  com$: Observable<RecepcionDeCompra>;
  loading$: Observable<boolean>;
  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getComsLoading));
    this.com$ = this.store.pipe(select(fromStore.getSelectedRecepcionDeCompra));
  }

  ngOnDestroy() {}

  onSave(event: RecepcionDeCompra) {
    if (!event.id) {
      this.store.dispatch(new fromActions.AddRecepcionDeCompra(event));
    } else {
      this.store.dispatch(new fromActions.UpdateRecepcionDeCompra(event));
    }
  }

  onDelete(event: RecepcionDeCompra) {
    this.store.dispatch(new fromActions.DeleteRecepcionDeCompra(event));
  }

  onInventariar(event: RecepcionDeCompra) {
    console.log('Inventariar: ', event);
  }

  getPrintUrl(event: RecepcionDeCompra) {
    return `coms/print/${event.id}`;
  }
}
