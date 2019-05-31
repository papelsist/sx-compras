import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromCobranza from 'app/cobranza/store';

import { Observable } from 'rxjs';
import { Bonificacion, NotaDeCredito, Cartera } from 'app/cobranza/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sx-bonificaciones',
  templateUrl: './bonificaciones.component.html',
  styleUrls: ['./bonificaciones.component.scss']
})
export class BonificacionesComponent implements OnInit {
  bonificaciones$: Observable<Bonificacion[]>;
  loading$: Observable<boolean>;
  cartera$: Observable<Cartera>;
  constructor(
    private store: Store<fromStore.State>,
    private route: ActivatedRoute // Required to create relative routes for the ngrx store dispatch Go action
  ) {}

  ngOnInit() {
    this.bonificaciones$ = this.store.pipe(
      select(fromStore.getAllBonificaciones)
    );
    this.loading$ = this.store.pipe(select(fromStore.getBonificacionLoading));
    this.cartera$ = this.store.pipe(select(fromCobranza.getCartera));
  }

  onSelect(nota: NotaDeCredito) {
    if (nota.disponible > 0.0) {
      this.doEdit(nota);
    }
  }

  onCreate(event: Partial<Bonificacion>) {
    this.store.dispatch(
      new fromStore.CreateBonificacion({ bonificacion: event })
    );
  }

  private doEdit(nota: NotaDeCredito) {
    this.store.dispatch(
      new fromRoot.Go({
        path: ['edit/', nota.id],
        extras: { relativeTo: this.route }
      })
    );
  }
}
