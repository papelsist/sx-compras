import { Component, OnInit, Input } from '@angular/core';
import { CobrosFilter } from '../../models';

@Component({
  selector: 'sx-cobros-filter-label',
  template: `
  <div layout layout-align="center center" class="pad-bottom text-sm tc-indigo-500">
    <span *ngIf="filter.nombre" >{{filter.nombre}}</span>
    <span *ngIf="filter.fechaInicial" class="pad-left">Del: {{filter.fechaInicial | date: 'dd/MM/yyyy'}}</span>
    <span *ngIf="filter.fechaFinal" class="pad-left">al: {{filter.fechaFinal | date: 'dd/MM/yyyy'}}</span>
    <span *ngIf="filter.tipo" class="pad-left">({{filter.tipo}})</span>
  <div>
  `
})
export class CobrosFilterLabelComponent implements OnInit {
  @Input()
  filter: CobrosFilter;
  constructor() {}

  ngOnInit() {}
}
