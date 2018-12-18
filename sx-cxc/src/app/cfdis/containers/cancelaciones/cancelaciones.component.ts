import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromCfdis from '../../store/actions/cfdis.actions';

import { Observable } from 'rxjs';

import { Cfdi, CfdisFilter } from '../../models';

@Component({
  selector: 'sx-cfdis-cancelados',
  template: `
    <mat-card>
      <div layout="row" layout-align="start center" class="pad-left pad-right">
        <span class="push-left-sm">
          <span class="mat-title"
            >Cancelaciones de comprobantes fiscales (CFDI's)</span
          >
        </span>
        <span flex></span>
        <td-search-box
          class="push-right-sm"
          placeholder="Fitrar"
          flex
          (searchDebounce)="filter($event)"
          [value]="search$ | async"
        >
        </td-search-box>
        <button mat-icon-button (click)="load()">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>
      <mat-divider></mat-divider>

      <mat-tab-group>
        <mat-tab label="PENDIENTES"> </mat-tab>
        <mat-tab label="CANCELADOS"> </mat-tab>
      </mat-tab-group>
    </mat-card>
  `,
  styles: [
    `
      .mat-card {
        width: calc(100% - 15px);
        height: calc(100% - 10px);
      }
    `
  ]
})
export class CancelacionesComponent implements OnInit {
  cfdis$: Observable<Cfdi[]>;
  filter$: Observable<CfdisFilter>;
  search$: Observable<string>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.cfdis$ = this.store.pipe(select(fromStore.getAllCfdis));
    this.filter$ = this.store.pipe(select(fromStore.getCfdisFilter));
    this.search$ = this.store.pipe(select(fromStore.getCfdisSearchTerm));
  }

  filter(term: string) {
    this.store.dispatch(new fromCfdis.SetCfdisSearchTerm({ term }));
  }

  onPdf(event: Cfdi) {
    this.store.dispatch(new fromCfdis.ImprimirCfdi(event.id));
  }

  onXml(cfdi: Cfdi) {
    this.store.dispatch(new fromCfdis.MostrarXmlCfdi({ cfdi }));
  }

  onSelect(event: Cfdi[]) {
    const ids = event.map(item => item.id);
    // this.store.dispatch(new fromCfdis.SelectCfdis({ ids }));
  }

  load() {
    this.store.dispatch(new fromCfdis.LoadCfdis());
  }
}
