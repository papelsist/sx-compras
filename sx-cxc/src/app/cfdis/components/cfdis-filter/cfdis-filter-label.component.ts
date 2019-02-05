import { Component, OnInit, Input } from '@angular/core';
import { CfdisFilter } from '../../models';

@Component({
  selector: 'sx-cfdis-filter-label',
  template: `
    <div
      layout
      layout-align="center center"
      class="pad-bottom text-sm tc-indigo-500"
    >
      <span *ngIf="filter.receptor">Receptor: {{ filter.receptor }}</span>
      <span *ngIf="filter.fechaInicial" class="pad-left"
        >Del: {{ filter.fechaInicial | date: 'dd/MM/yyyy' }}</span
      >
      <span *ngIf="filter.fechaFinal" class="pad-left"
        >al: {{ filter.fechaFinal | date: 'dd/MM/yyyy' }}</span
      >
      <div></div>
    </div>
  `
})
export class CfdisFilterLabelComponent implements OnInit {
  @Input()
  filter: CfdisFilter;
  constructor() {}

  ngOnInit() {}
}
