import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Analisis } from '../../model/analisis';
import { Periodo } from 'app/_core/models/periodo';
import { ReportService } from 'app/reportes/services/report.service';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.scss']
})
export class AnalisisComponent implements OnInit {
  loading$: Observable<boolean>;
  analisis$: Observable<Analisis[]>;
  periodo$: Observable<Periodo>;

  totales: any = {};

  constructor(
    private store: Store<fromStore.CxpState>,
    private service: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getAnalisisLoading));
    this.analisis$ = this.store.select(fromStore.getAllAnalisis);
    this.periodo$ = this.store.pipe(select(fromStore.getAnalisisPeriodo));
  }

  reload() {
    this.store.dispatch(new fromStore.Load());
  }

  onCreate() {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/analisis/create'] }));
  }

  onSelect(event: Analisis) {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/analisis', event.id] }));
  }

  onTotales(event: any) {
    this.totales = event;
  }

  onPeriodo(event: Periodo) {
    if (event) {
      this.store.dispatch(new fromStore.SetAnalisisPeriodo(event));
    }
  }

  onTipo(event: string) {
    this.store.dispatch(new fromStore.SetSearchFilter({ tipo: event }));
  }

  onPrint(analisis: Partial<Analisis>) {
    if (analisis.factura.moneda !== 'MXN') {
      this.confirmarMoneda(analisis);
    } else {
      this.imprimir(analisis);
    }
  }

  private confirmarMoneda(analisis: Partial<Analisis>) {
    this.dialogService
      .openConfirm({
        title: `Analisis ${analisis.folio}`,
        message: `Imprimir en ${analisis.factura.moneda}`,
        acceptButton: 'Si',
        cancelButton: 'No'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.imprimir(analisis, analisis.factura.moneda);
        } else {
          this.imprimir(analisis);
        }
      });
  }

  private imprimir(analisis: Partial<Analisis>, moneda: string = 'MXN') {
    const params = { moneda };
    const url = `analisisDeFactura/print/${analisis.id}`;
    this.service.runReport(url, params);
  }
}
