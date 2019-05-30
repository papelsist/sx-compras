import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';
import { Bonificacion, NotaDeCredito } from 'app/cobranza/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sx-bonificaciones',
  templateUrl: './bonificaciones.component.html',
  styleUrls: ['./bonificaciones.component.scss']
})
export class BonificacionesComponent implements OnInit {
  bonificaciones$: Observable<Bonificacion[]>;
  loading$: Observable<boolean>;
  constructor(
    private store: Store<fromStore.State>,
    private route: ActivatedRoute // Required to create relative routes for the ngrx store dispatch Go action
  ) {}

  ngOnInit() {
    this.bonificaciones$ = this.store.pipe(
      select(fromStore.getAllBonificaciones)
    );
    this.loading$ = this.store.pipe(select(fromStore.getBonificacionLoading));
  }

  onSelect(nota: NotaDeCredito) {
    if (nota.disponible > 0.0) {
      this.doEdit(nota);
    }
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
