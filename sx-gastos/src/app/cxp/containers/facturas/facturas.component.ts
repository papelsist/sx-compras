import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/facturas.actions';

import { Observable, Subject } from 'rxjs';

import { ComprobanteFiscalService } from '../../services';
import { CuentaPorPagar, CxPFilter } from '../../model';
import { MatDialog } from '@angular/material';
import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-facturas-cxp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {
  facturas$: Observable<CuentaPorPagar[]>;
  filter$: Observable<CxPFilter>;
  search$ = new Subject<string>();
  periodo$: Observable<Periodo>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private service: ComprobanteFiscalService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getFacturasLoading));
    this.periodo$ = this.store.pipe(select(fromStore.selectFacturasPeriodo));
    this.filter$ = this.store.pipe(select(fromStore.getFacturasFilter));
    this.facturas$ = this.store.pipe(select(fromStore.getAllFacturas));
  }

  onSelect(event: Partial<CuentaPorPagar>) {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/facturas', event.id] }));
  }

  onSearch(event: string) {
    this.search$.next(event);
  }

  reload() {
    this.store.dispatch(new fromActions.LoadFacturas());
  }

  onPeriodo(periodo: Periodo) {
    this.store.dispatch(new fromActions.SetFacturasPeriodo({ periodo }));
  }

  onFilter(filter: CxPFilter) {
    this.store.dispatch(new fromActions.SetFacturasFilter({ filter }));
  }

  onPdf(event: CuentaPorPagar) {
    this.service.imprimirCfdi(event.comprobanteFiscal.id);
  }

  onEdit(event: CuentaPorPagar) {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/facturas', event.id] }));
  }
}
