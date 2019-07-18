import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/facturas.actions';

import { Observable } from 'rxjs';

import { Periodo } from '../../../_core/models/periodo';
import { CuentaPorPagar } from '../../model';

@Component({
  selector: 'sx-cartera-page',
  templateUrl: './cartera-page.component.html',
  styleUrls: ['./cartera-page.component.scss']
})
export class CarteraPageComponent implements OnInit {
  loading$: Observable<boolean>;
  facturas$: Observable<CuentaPorPagar[]>;
  periodo$: Observable<Periodo>;

  selected: Partial<CuentaPorPagar>[] = [];

  constructor(private store: Store<fromStore.CxpState>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getFacturasLoading));
    this.periodo$ = this.store.pipe(select(fromStore.getPeriodoDeFacturas));
    this.facturas$ = this.store.pipe(select(fromStore.getAllFacturas));
  }

  reload() {
    this.store.dispatch(new fromActions.LoadFacturas());
  }

  onSelection(event: Partial<CuentaPorPagar>[]) {
    this.selected = event;
  }

  ajustarDiferencia(facturas: Partial<CuentaPorPagar>[]) {
    console.log('Ajustar diferencias....', facturas.length);
  }
}
