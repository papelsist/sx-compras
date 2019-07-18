import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Bonificacion, NotaDeCredito } from 'app/cobranza/models';

@Component({
  selector: 'sx-bonificacion-edit-page',
  templateUrl: './bonificacion-edit-page.component.html',
  styleUrls: ['./bonificacion-edit-page.component.scss']
})
export class BonificacionEditPageComponent implements OnInit {
  bonificacion$: Observable<Bonificacion>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getBonificacionLoading));
    this.bonificacion$ = this.store.pipe(
      select(fromStore.getSelectedBonificacion)
    );
  }

  onSave(event: { id: string; changes: Partial<NotaDeCredito> }) {
    this.store.dispatch(new fromStore.UpdateBonificacion({ update: event }));
  }
  onDelete(bonificacion: Bonificacion) {
    this.store.dispatch(new fromStore.DeleteBonificacion({ bonificacion }));
  }

  onAplicar(bonificacion: Bonificacion) {
    this.store.dispatch(
      new fromStore.AplicarBonificacion({ notaId: bonificacion.id })
    );
  }

  generarCfdi(bonificacion: Bonificacion) {
    this.store.dispatch(
      new fromStore.GenerarBonificacionCfdi({ notaId: bonificacion.id })
    );
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Back());
  }

  onCancelBonificacion(bonificacion: Bonificacion) {
    // this.store.dispatch(new fromStore.Cancelar)
  }

  onCancelCfdi(bonificacion: Bonificacion) {
    this.store.dispatch(
      new fromStore.CancelarBonificacionCfdi({ notaId: bonificacion.id })
    );
  }

  onCamiarCfdi(bonificacion: Bonificacion) {
    this.store.dispatch(
      new fromStore.CancelarBonificacionCfdi({ notaId: bonificacion.id })
    );
  }
}
