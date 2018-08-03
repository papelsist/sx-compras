import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/notas.actions';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TdDialogService } from '@covalent/core';

import { NotaDeCreditoCxP } from '../../model/notaDeCreditoCxP';

@Component({
  selector: 'sx-nota',
  template: `
    <div>
      <sx-nota-form [nota]="nota$ | async"
        (save)="onSave($event)"
        (delete)="onDelete($event)">
      </sx-nota-form>
    </div>
  `
})
export class NotaComponent implements OnInit, OnDestroy {
  nota$: Observable<NotaDeCreditoCxP>;

  constructor(
    private store: Store<fromStore.CxpState>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.nota$ = this.store.pipe(select(fromStore.getSelectedNota));
  }

  ngOnDestroy() {}

  onSave(event: NotaDeCreditoCxP) {
    this.store.dispatch(new fromActions.UpdateNota(event));
  }

  onDelete(event: NotaDeCreditoCxP) {
    this.store.dispatch(new fromActions.DeleteNota(event));
  }
  onCerrar(event: NotaDeCreditoCxP) {
    console.log('Cerrar: ', event);
  }

  onAplicar(event: NotaDeCreditoCxP) {
    this.store.dispatch(new fromActions.AplicarNota(event));
  }
}
