import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/pagos.actions';

import { Observable, Subject } from 'rxjs';

import { Pago } from '../../model';

import { ComprobanteFiscalService } from '../../services';

@Component({
  selector: 'sx-pagos',
  template: `
    <mat-card>
      <sx-search-title title="Pagos de facturas" (search)="onSearch($event)">
      <mat-checkbox class="options">Pendientes</mat-checkbox>
      </sx-search-title>
      <mat-divider></mat-divider>
      <sx-pagos-table [pagos]="pagos$ | async" (xml)="onXml($event)" (pdf)="onPdf($event)" [filter]="search$ | async"></sx-pagos-table>
    </mat-card>
  `
})
export class PagosComponent implements OnInit {
  pagos$: Observable<Pago[]>;
  search$ = new Subject<string>();

  constructor(
    private store: Store<fromStore.State>,
    private service: ComprobanteFiscalService
  ) {}

  ngOnInit() {
    this.pagos$ = this.store.pipe(select(fromStore.getAllPagos));
  }

  onSelect() {}

  onSearch(event: string) {
    this.search$.next(event);
  }

  onPdf(event: Pago) {
    this.service.imprimirCfdi(event.comprobanteFiscal.id);
  }

  onXml(event: Pago) {}
}
