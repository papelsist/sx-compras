import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
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

  generarCfdi(bonificacion: Bonificacion) {
    this.store.dispatch(
      new fromStore.GenerarBonificacionCfdi({ notaId: bonificacion.id })
    );
  }
}
