import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Analisis } from '../../model/analisis';

@Component({
  selector: 'sx-analisis',
  template: `
    <mat-card>
      <sx-search-title title="Análisis de facturas"></sx-search-title>
      <mat-divider></mat-divider>
      <div class="mat-elevation-z8 analisis-table-panel">
        <sx-analisis-table [analisis]=" analisis$ | async"
        (select)="onSelect($event)" (edit)="onEdit($event)">
        </sx-analisis-table>
      </div>
    </mat-card>
    <div layout *ngIf="selected">
      <mat-card class="analisis-partidas-panel" flex="60">

      </mat-card>
    </div>


    <a mat-fab matTooltip="Nuevo análisis" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      [routerLink]="['create']">
	    <mat-icon>add</mat-icon>
    </a>
  `,
  styles: [
    `
    .analisis-table-panel {
      min-height: 250px;
      max-height: 550px;
      overflow: auto;
    }
    .analisis-partidas-panel {
      min-height: 200px;
      max-height: 600px;
      overflow: auto;
    }
  `
  ]
})
export class AnalisisComponent implements OnInit {
  analisis$: Observable<Analisis[]>;
  selected: any;
  constructor(private store: Store<fromStore.CxpState>) {}

  ngOnInit() {
    this.analisis$ = this.store.select(fromStore.getAllAnalisis);
  }

  onSelect(event: Analisis[]) {
    this.selected = event;
  }

  onEdit(event: Analisis) {
    console.log('Editando: ', event);
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/analisis', event.id] }));
  }
}
