import { Component, OnInit, Input } from '@angular/core';
import { RequisicionesFilter } from '../../models';

@Component({
  selector: 'sx-requisiciones-filter-label',
  template: `
  <div layout layout-align="center center" class="pad-bottom text-sm tc-indigo-500">
    <span *ngIf="filter.proveedor" >{{filter.proveedor.nombre}}</span>
    <span *ngIf="filter.fechaInicial" class="pad-left">Del: {{filter.fechaInicial | date: 'dd/MM/yyyy'}}</span>
    <span *ngIf="filter.fechaFinal" class="pad-left">al: {{filter.fechaFinal | date: 'dd/MM/yyyy'}}</span>
    <span *ngIf="filter.pendientes" class="pad-left tc-pink-800">(Solo pendientes)</span>
  <div>
  `
})
export class RequisicionesFilterLabelComponent implements OnInit {
  @Input()
  filter: RequisicionesFilter;
  constructor() {}

  ngOnInit() {}
}
