import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/pagos.actions';

import { Observable } from 'rxjs';

import { Pago } from '../../model';
import { Periodo } from 'app/_core/models/periodo';
import { ComprobanteFiscalService } from '../../services';

@Component({
  selector: 'sx-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
  loading$: Observable<boolean>;
  pagos$: Observable<Pago[]>;
  periodo$: Observable<Periodo>;
  totales: any = {};

  constructor(
    private store: Store<fromStore.CxpState>,
    private service: ComprobanteFiscalService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getPagosLoading));
    this.periodo$ = this.store.pipe(select(fromStore.getPeriodoDePagos));
    this.pagos$ = this.store.pipe(select(fromStore.getAllPagos));
  }

  onSelect(event: Pago) {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/pagos', event.id] }));
  }

  reload() {
    this.store.dispatch(new fromActions.LoadPagos());
  }

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromActions.SetPeriodoDePagos({ periodo: event }));
  }

  onPdf(event: Pago) {
    this.service.imprimirCfdi(event.comprobanteFiscal.id);
  }

  onXml(event: Pago) {
    this.service.mostrarXml2(event.comprobanteFiscal.id).subscribe(res => {
      const blob = new Blob([res], {
        type: 'text/xml'
      });
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }
}
/**
 * template: `
    <mat-card>
      <sx-search-title title="Pagos de facturas" (search)="onSearch($event)">
        <mat-checkbox class="options">Pendientes</mat-checkbox>
      </sx-search-title>
      <mat-divider></mat-divider>
      <sx-pagos-table
        [partidas]="pagos$ | async"
        (xml)="onXml($event)"
        (pdf)="onPdf($event)"
      ></sx-pagos-table>
    </mat-card>
  `
 */
