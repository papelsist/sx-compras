import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromCfdis from '../../store/actions/por-cancelar.actions';

import { Observable } from 'rxjs';

import { Cfdi, CfdisFilter } from '../../models';
import { TdDialogService } from '@covalent/core';

import * as moment from 'moment';

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
      <ng-template
        tdLoading
        [tdLoadingUntil]="!(loading$ | async)"
        tdLoadingStrategy="overlay"
      >
        <sx-cfdis-por-cancelar-table
          [comprobantes]="cfdis$ | async"
          [filter]="search"
          (select)="onSelect($event)"
          (cancelar)="onCancelar($event)"
        ></sx-cfdis-por-cancelar-table>
      </ng-template>
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
  loading$: Observable<boolean>;

  search: string;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getPorCancelarLoading));
    this.cfdis$ = this.store.pipe(select(fromStore.getAllPorCancelar));
  }

  filter(event: string) {
    this.search = event;
  }

  load() {
    this.store.dispatch(new fromCfdis.LoadCfdisPorCancelar());
  }

  onSelect(event: Cfdi[]) {
    // console.log('Selected: ', event[0]);
  }

  onCancelar(cfdi: Cfdi) {
    this.dialogService
      .openConfirm({
        message: `Cfdi Fecha: ${moment(cfdi.fecha).format(
          'DD/MM/YYYY'
        )}, Total: ${cfdi.total} (Operación irreversible)`,
        title: `Cancelación de CFDI: ${cfdi.serie}-${cfdi.folio} `,
        cancelButton: 'ABORTAR',
        acceptButton: 'CANCELAR CFDI',
        width: '650px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.CancelarCfdi({ cfdi }));
        }
      });
  }
}
