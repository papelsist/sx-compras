import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/facturas.actions';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Periodo } from '../../../_core/models/periodo';
import { ComprobanteFiscalService } from '../../services';
import { CuentaPorPagar } from '../../model';

@Component({
  selector: 'sx-facturas-cxp',
  template: `
    <mat-card>
      <sx-search-title title="Facturas de compras" (search)="onSearch($event)">
      <div *ngIf="periodo$ | async as periodo" class="info">
        <span class="pad-left">Periodo: </span>
        <span class="pad-left">{{periodo}}</span>
        <sx-periodo-picker [periodo]="periodo" (change)="cambiarPeriodo($event)"></sx-periodo-picker>
      </div>
      </sx-search-title>
      <mat-divider></mat-divider>
      <sx-facturas-table [facturas]="facturas$ | async" (xml)="onXml($event)" (pdf)="onPdf($event)" (analisis)="onAnalisis($event)"
        [filter]="search$ | async">
      </sx-facturas-table>
    </mat-card>
  `
})
export class FacturasComponent implements OnInit {
  facturas$: Observable<CuentaPorPagar[]>;
  periodo$: Observable<Periodo>;
  search$ = new BehaviorSubject('');

  constructor(
    private store: Store<fromStore.CxpState>,
    private service: ComprobanteFiscalService
  ) {}

  ngOnInit() {
    this.periodo$ = this.store.pipe(select(fromStore.getPeriodoDeFacturas));
    this.facturas$ = this.store.pipe(select(fromStore.getAllFacturas));
  }

  onSelect() {}

  onSearch(event: string) {
    this.search$.next(event);
  }

  cambiarPeriodo(event: Periodo) {
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
    // console.log('Localizad el analiziz: ', event);
    this.store.dispatch(
      new fromRoot.Go({ path: ['cxp/analisis', event.analisis] })
    );
  }
}
