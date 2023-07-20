import { Component, OnInit, Input } from '@angular/core';
import { RequisicionesFilter } from '../../model';

@Component({
  selector: 'sx-requisiciones-filter-label',
  template: `
  <div layout layout-align="center center" class="pad-bottom text-sm tc-indigo-500">
    <span *ngIf="filter.proveedor" >{{filter.proveedor.nombre}}</span>
    <span *ngIf="filter.fechaInicial" class="pad-left">Del: {{changeDate(filter.fechaInicial) | date: 'dd/MM/yyyy'}}</span>
    <span *ngIf="filter.fechaFinal" class="pad-left">al: {{changeDate(filter.fechaFinal) | date: 'dd/MM/yyyy'}}</span>
  <div>
  `
})
export class RequisicionesFilterLabelComponent implements OnInit {
  @Input()
  filter: RequisicionesFilter;
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
