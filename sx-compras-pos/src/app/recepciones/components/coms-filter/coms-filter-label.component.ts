import { Component, OnInit, Input } from '@angular/core';
import { ComsFilter } from '../../models/recepcionDeCompra';

@Component({
  selector: 'sx-coms-filter-label',
  template: `
  <div layout layout-align="center center" class="pad-bottom text-sm tc-indigo-500">
    <span *ngIf="filter.proveedor" >{{filter.proveedor.nombre}}</span>
    <span *ngIf="filter.fechaInicial" class="pad-left">Del: {{filter.fechaInicial | date: 'dd/MM/yyyy'}}</span>
    <span *ngIf="filter.fechaFinal" class="pad-left">al: {{filter.fechaFinal | date: 'dd/MM/yyyy'}}</span>
  <div>
  `
})
export class ComsFilterLabelComponent implements OnInit {
  @Input() filter: ComsFilter;
  constructor() {}

  ngOnInit() {}
}
