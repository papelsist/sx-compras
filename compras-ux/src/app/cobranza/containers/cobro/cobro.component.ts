import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Cobro } from '../../models/cobro';
import { CuentaPorCobrar, AplicacionDeCobro } from 'app/cobranza/models';

@Component({
  selector: 'sx-cobro',
  templateUrl: './cobro.component.html',
  styleUrls: ['./cobro.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CobroComponent implements OnInit {
  cobro$: Observable<Cobro>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getCobrosLoading));
    this.cobro$ = this.store.pipe(select(fromStore.getSelectedCobro));
  }

  generarRecibo(cobro: Cobro) {}

  imprimirRecibo(cobro: Cobro) {}

  mandarPorCorreo(cobro: Cobro) {}

  registrarAplicacion(cobro: Cobro, pendientes: CuentaPorCobrar[]) {
    const cobroId = cobro.id;
    const facturas = pendientes.map(item => item.id);
    this.store.dispatch(
      new fromStore.RegistrarAplicaciones({ cobroId, facturas })
    );
  }

  eliminarAplicacion(aplicacion: AplicacionDeCobro) {
    this.store.dispatch(
      new fromStore.EliminarAplicacion({ aplicationId: aplicacion.id })
    );
  }
}
