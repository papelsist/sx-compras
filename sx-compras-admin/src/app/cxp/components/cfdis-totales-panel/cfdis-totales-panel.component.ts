import { Component, OnInit, Input } from '@angular/core';

import { ComprobanteFiscal } from '../../model/comprobanteFiscal';

import * as _ from 'lodash';

@Component({
  selector: 'sx-cfdis-totales-panel',
  template: `
    <mat-list class="totales-list">
      <mat-list-item>
        <h2 mat-line>CFDIs</h2>
        <span>{{comprobantes.length}}</span>
        <mat-divider [inset]="true" ></mat-divider>
      </mat-list-item>

      <mat-list-item>
        <span mat-line>Total</span>
        <span>{{total | currency}}</span>
      </mat-list-item>
    </mat-list>
  `,
  styles: [
    `
    .totales-list {
      min-width: 400px;
    }
  `
  ]
})
export class CfdisTotalesPanelComponent implements OnInit {
  @Input() comprobantes: ComprobanteFiscal[] = [];
  constructor() {}

  ngOnInit() {}

  get total() {
    return _.sumBy(this.comprobantes, 'total');
  }
}
