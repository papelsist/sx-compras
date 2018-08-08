import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/contrarecibos.actions';

import { Observable, Subject } from 'rxjs';

import { ComprobanteFiscalService } from '../../services';
import { Contrarecibo } from '../../model';

@Component({
  selector: 'sx-recibos-cxp',
  template: `
    <mat-card>
      <sx-search-title title="Contrarecibos" (search)="onSearch($event)">
      </sx-search-title>
      <mat-divider></mat-divider>
      <div class="recibos-panel">
        <sx-recibos-table [recibos]="recibos$ | async"></sx-recibos-table>
      </div>
    </mat-card>
    <a mat-fab matTooltip="Alta de contrarecibo" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      [routerLink]="['create']">
    <mat-icon>add</mat-icon>
  `,
  styles: [
    `
    .recibos-panel {
      min-height: 300px;
    }
  `
  ]
})
export class RecibosComponent implements OnInit {
  recibos$: Observable<Contrarecibo[]>;
  search$ = new Subject<string>();

  constructor(
    private store: Store<fromStore.CxpState>,
    private service: ComprobanteFiscalService
  ) {}

  ngOnInit() {
    this.recibos$ = this.store.pipe(select(fromStore.getAllContrarecibos));
  }

  onSelect() {}

  onSearch(event: string) {
    this.search$.next(event);
  }
}
