import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/facturas.actions';

import { Observable } from 'rxjs';

import { Periodo } from '../../../_core/models/periodo';
import { ComprobanteFiscalService } from '../../services';
import { CuentaPorPagar } from '../../model';

@Component({
  selector: 'sx-facturas-cxp',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {
  loading$: Observable<boolean>;
  facturas$: Observable<CuentaPorPagar[]>;
  periodo$: Observable<Periodo>;
  totales: any = {};

  constructor(
    private store: Store<fromStore.CxpState>,
    private service: ComprobanteFiscalService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getFacturasLoading));
    this.periodo$ = this.store.pipe(select(fromStore.getPeriodoDeFacturas));
    this.facturas$ = this.store.pipe(select(fromStore.getAllFacturas));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadFacturas());
  }

  onSelect() {}

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromActions.SetFacturasPeriodo(event));
  }

  onPdf(event: CuentaPorPagar) {
    this.service.imprimirCfdi(event.comprobanteFiscal.id);
  }

  onXml(event: CuentaPorPagar) {
    this.service.mostrarXml2(event.comprobanteFiscal.id).subscribe(res => {
      const blob = new Blob([res], {
        type: 'text/xml'
      });
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }

  onAnalisis(event: CuentaPorPagar) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['cxp/analisis', event.analisis] })
    );
  }
}
