import { Component, OnInit, Input } from '@angular/core';
import { PeriodoFilter } from 'app/models';

@Component({
  selector: 'sx-periodo-filter-label',
  template: `
  <div layout layout-align="center center" class="pad-bottom text-sm tc-indigo-500">
    <span *ngIf="filter.fechaInicial" class="pad-left">Del: {{(filter.fechaInicial) | date: 'dd/MM/yyyy'}}</span>
    <span *ngIf="filter.fechaFinal" class="pad-left">al: {{(filter.fechaFinal) | date: 'dd/MM/yyyy'}}</span>
  <div>
  `
})
export class PeriodoFilterLabelComponent implements OnInit {
  @Input()
  filter: PeriodoFilter;
  constructor() {}

  ngOnInit() {}
  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
