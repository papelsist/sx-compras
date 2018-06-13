import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import { ComprobanteFiscal } from '../../model/comprobanteFiscal';

import * as _ from 'lodash';
import {} from '@angular/compiler/src/core';

@Component({
  selector: 'sx-cfdis-totales-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
