import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromCfdis from '../../store/actions/cfdi.actions';

import { Observable } from 'rxjs';

import { ComprobanteFiscal, CfdisFilter } from '../../model/comprobanteFiscal';

@Component({
  selector: 'sx-cxp-cfdis',
  template: `
    <mat-card>
      <div layout="row" layout-align="start center" class="pad-left pad-right">
        <span class="push-left-sm">
          <span class="mat-title">Comprobantes fiscales (CFDI's)</span>
        </span>
        <span flex></span>
        <td-search-box class="push-right-sm" placeholder="Fitrar" flex
            (searchDebounce)="filter($event)" [value]="search$ | async">
        </td-search-box>
        <sx-cfdis-filter-btn [filter]="filter$ | async"></sx-cfdis-filter-btn>
        <button mat-icon-button (click)="load()"><mat-icon>refresh</mat-icon></button>
      </div>
      <mat-divider></mat-divider>
      <sx-cfdis-table [comprobantes]="cfdis$ | async" (pdf)="onPdf($event)" [selected]="selected$ | async"
        (xml)="onXml($event)" (select)="onSelect($event)" [filter]="search$ | async"></sx-cfdis-table>
      <sx-cfdis-filter-label [filter]="filter$ | async"></sx-cfdis-filter-label>
    </mat-card>
    <sx-cfdis-conceptos></sx-cfdis-conceptos>
  `,
  styles: [
    `
      .cfdis-panel {
        min-height: 200px;
        overflow: auto;
      }
      .cfdis-det-panel {
        min-height: 200px;
      }
    `
  ]
})
export class CfdisComponent implements OnInit {
  cfdis$: Observable<ComprobanteFiscal[]>;
  selected$: Observable<ComprobanteFiscal[]>;
  filter$: Observable<CfdisFilter>;
  search$: Observable<string>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.cfdis$ = this.store.pipe(select(fromStore.getAllComprobantes));
    this.filter$ = this.store.pipe(select(fromStore.getComprobantesFilter));
    this.search$ = this.store.pipe(select(fromStore.getComprobantesSearchTerm));
    this.selected$ = this.store.pipe(select(fromStore.getSelectedCfdis));
  }

  filter(term: string) {
    this.store.dispatch(new fromCfdis.SetCfdisSearchTerm({ term }));
  }

  onPdf(event: ComprobanteFiscal) {
    this.store.dispatch(new fromCfdis.ImprimirComprobante(event.id));
  }

  onXml(cfdi: ComprobanteFiscal) {
    this.store.dispatch(new fromCfdis.MostrarXmlComprobante({ cfdi }));
  }

  onSelect(event: ComprobanteFiscal[]) {
    const ids = event.map(item => item.id);
    this.store.dispatch(new fromCfdis.SelectCfdis({ ids }));
  }

  load() {
    this.store.dispatch(new fromCfdis.LoadComprobantes());
  }
}
