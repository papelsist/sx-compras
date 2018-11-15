import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/facturas.actions';

import { Observable, Subject } from 'rxjs';

import { ComprobanteFiscalService } from '../../services';
import { CuentaPorPagar, CxPFilter } from '../../model';
import { MatDialog } from '@angular/material';
import { CxPFormComponent } from 'app/cxp/components';

@Component({
  selector: 'sx-facturas-cxp',
  template: `
    <mat-card>
      <sx-search-title title="Facturas de compras (Cuentas por pagar)" (search)="onSearch($event)">
        <sx-facturas-filter-btn class="options" [filter]="filter$ | async" (change)="onFilter($event)"></sx-facturas-filter-btn>
      </sx-search-title>
      <mat-divider></mat-divider>
      <sx-facturas-table [facturas]="facturas$ | async" (xml)="onXml($event)" (pdf)="onPdf($event)" (edit)="onEdit($event)"
        [filter]="search$ | async">
      </sx-facturas-table>
      <mat-card-footer>
        <sx-facturas-filter-label [filter]="filter$ | async"></sx-facturas-filter-label>
      </mat-card-footer>
    </mat-card>
  `
})
export class FacturasComponent implements OnInit {
  facturas$: Observable<CuentaPorPagar[]>;
  filter$: Observable<CxPFilter>;
  search$ = new Subject<string>();

  constructor(
    private store: Store<fromStore.State>,
    private service: ComprobanteFiscalService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.filter$ = this.store.pipe(select(fromStore.getFacturasFilter));
    this.facturas$ = this.store.pipe(select(fromStore.getAllFacturas));
  }

  onSelect() {}

  onSearch(event: string) {
    this.search$.next(event);
  }

  onFilter(filter: CxPFilter) {
    this.store.dispatch(new fromActions.SetFacturasFilter({ filter }));
  }

  onPdf(event: CuentaPorPagar) {
    this.service.imprimirCfdi(event.comprobanteFiscal.id);
  }

  onXml(event: CuentaPorPagar) {}

  onEdit(event: CuentaPorPagar) {
    this.dialog
      .open(CxPFormComponent, { data: { cxp: event } })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const update = {
            id: event.id,
            changes: res
          };
          this.store.dispatch(new fromActions.UpdateFactura({ update }));
        }
      });
  }
}
