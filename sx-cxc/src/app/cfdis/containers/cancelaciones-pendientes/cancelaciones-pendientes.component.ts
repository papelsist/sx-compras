import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromCfdis from '../../store/actions/por-cancelar.actions';

import { Observable } from 'rxjs';

import { Cfdi, CfdisFilter } from '../../models';

@Component({
  selector: 'sx-cancelaciones-pendientes',
  template: `
    <mat-card>
      <div layout="row" layout-align="start center" class="pad-left pad-right">
        <span class="push-left-sm">
          <span class="mat-title">CFDIs Pendientes de cancelar </span>
        </span>
        <span flex></span>
        <td-search-box
          class="push-right-sm"
          placeholder="Fitrar"
          flex
          (searchDebounce)="filter($event)"
        >
        </td-search-box>
        <button mat-icon-button (click)="load()">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>
      <mat-divider></mat-divider>
      <sx-cfdis-table
        [comprobantes]="cfdis$ | async"
        [filter]="search"
        (select)="onSelect($event)"
      ></sx-cfdis-table>
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
export class CancelacionesPendientesComponent implements OnInit {
  cfdis$: Observable<Cfdi[]>;

  search: string;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.cfdis$ = this.store.pipe(select(fromStore.getAllPorCancelar));
  }

  filter(event: string) {
    this.search = event;
  }

  load() {
    this.store.dispatch(new fromCfdis.LoadCfdisPorCancelar());
  }

  onSelect(event: Cfdi[]) {
    console.log('Selected: ', event[0]);
  }
}
