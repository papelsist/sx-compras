import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromCancelaciones from '../../store/actions/cancelados.actions';

import { Observable } from 'rxjs';

import { CfdisFilter, CfdiCancelado } from '../../models';
import { CfdisCanceladosService } from 'app/cfdis/services';

@Component({
  selector: 'sx-cfdis-cancelados',
  template: `
    <mat-card>
      <div layout="row" layout-align="start center" class="pad-left pad-right">
        <span class="push-left-sm">
          <span class="mat-title">Cancelaciones de CFDIs registradas </span>
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
        <sx-cfdis-filter-btn
          (change)="onFilterChanged($event)"
          [filter]="filter$ | async"
        ></sx-cfdis-filter-btn>
      </div>
      <mat-divider></mat-divider>
      <ng-template
        tdLoading
        [tdLoadingUntil]="!(loading$ | async)"
        tdLoadingStrategy="overlay"
      >
        <sx-cancelaciones-table
          [cancelaciones]="cancelaciones$ | async"
          (ack)="onAcuse($event)"
          (download)="onDownload($event)"
        ></sx-cancelaciones-table>
      </ng-template>
      <mat-card-footer>
        <div layout>
          <span flex></span>
          <sx-cfdis-filter-label
            flex
            [filter]="filter$ | async"
          ></sx-cfdis-filter-label>
          <span flex></span>
        </div>
      </mat-card-footer>
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
  cancelaciones$: Observable<CfdiCancelado[]>;
  filter$: Observable<CfdisFilter>;
  search$: Observable<string>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private service: CfdisCanceladosService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(fromStore.getCfdisCanceladosLoading)
    );
    this.cancelaciones$ = this.store.pipe(
      select(fromStore.getAllCfdisCancelados)
    );
    this.filter$ = this.store.pipe(select(fromStore.getCfdisCanceladosFilter));
    this.search$ = this.store.pipe(
      select(fromStore.getCfdisCanceladosSearchTerm)
    );
  }

  filter(term: string) {
    // this.store.dispatch(new fromCfdis.SetCfdisSearchTerm({ term }));
  }

  onAcuse(cancelacion: CfdiCancelado) {
    this.store.dispatch(
      new fromCancelaciones.MostrarAcuseDeCancelacion({ cancelacion })
    );
  }

  onSelect(event: CfdiCancelado[]) {}

  load() {
    this.store.dispatch(new fromCancelaciones.LoadCfdisCancelados());
  }

  onFilterChanged(event: CfdisFilter) {
    this.store.dispatch(
      new fromCancelaciones.SetCfdisCanceladosFilter({ filter: event })
    );
  }

  onDownload(event: CfdiCancelado) {
    this.service.descargarAcuse(event).subscribe(data => {
      const blob = new Blob([data], { type: 'text/xml' });
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `ACK_CANCEL_${event.serie}-${event.folio}`;
      link.click();
    });
  }
}
