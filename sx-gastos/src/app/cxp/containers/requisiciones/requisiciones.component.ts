import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Requisicion } from '../../model';

@Component({
  selector: 'sx-cxp-requisiciones',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
    <mat-card>
      <div layout="row" layout-align="start center" class="pad-left pad-right">
        <span class="push-left-sm " layout="column">
          <span class="pad-right mat-title">Requisiciones de gastos  </span>
        </span>
      </div>
      <mat-divider></mat-divider>
      <div layout="column">
        <div class="cfdis-panel">
          <sx-requisiciones-table [comprobantes]="requisiciones$ | async"
            (print)="onPrint($event)"
            (select)="onSelect($event)"
            (edit)="onEdit($event)">
          </sx-requisiciones-table>
        </div>
      </div>
    </mat-card>
    <a mat-fab matTooltip="Alta de requisición" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      [routerLink]="['create']">
    <mat-icon>add</mat-icon>
    </a>
  </ng-template>
  `,
  styles: [
    `
      .cfdis-panel {
        min-height: 400px;
      }
      .cfdis-det-panel {
        min-height: 200px;
      }
    `
  ]
})
export class RequisicionesComponent implements OnInit {
  requisiciones$: Observable<Requisicion[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.requisiciones$ = this.store.pipe(
      select(fromStore.getAllRequisiciones)
    );
    this.loading$ = this.store.pipe(select(fromStore.getRequisicionLoading));
    this.loading$.subscribe(res => console.log('Loading: ', res));
  }

  onSelect(event: Requisicion[]) {}

  search(event: string) {}

  onEdit(event: Requisicion) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['cxp/requisiciones', event.id] })
    );
  }

  onPrint(event: Requisicion) {}
}
