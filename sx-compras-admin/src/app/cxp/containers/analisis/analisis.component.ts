import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Analisis } from '../../model/analisis';

@Component({
  selector: 'sx-analisis',
  template: `
    <mat-card>
      <sx-search-title title="Análisis de facturas"></sx-search-title>
      <mat-divider></mat-divider>
      <div class="mat-elevation-z8">
        <sx-analisis-table [analisis]=" analisis$ | async"></sx-analisis-table>
      </div>
    </mat-card>
    <a mat-fab matTooltip="Nuevo análisis" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      [routerLink]="['create']">
	    <mat-icon>add</mat-icon>
    </a>
  `
})
export class AnalisisComponent implements OnInit {
  analisis$: Observable<Analisis>;
  constructor() {}

  ngOnInit() {}
}
