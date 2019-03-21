import { Component, OnInit, Input } from '@angular/core';
import { EnviosFilter } from '../../model';

@Component({
  selector: 'sx-envios-filter-label',
  template: `
  <div layout layout-align="center center" class="pad-bottom text-sm tc-indigo-500">
    <span *ngIf="filter.sucursal" >{{filter.sucursal.nombre}}</span>
    <span *ngIf="filter.fechaInicial" class="pad-left">Del: {{filter.fechaInicial | date: 'dd/MM/yyyy'}}</span>
    <span *ngIf="filter.fechaFinal" class="pad-left">al: {{filter.fechaFinal | date: 'dd/MM/yyyy'}}</span>
  <div>
  `
})
export class EnviosFilterLabelComponent implements OnInit {
  @Input()
  filter: EnviosFilter;
  constructor() {}

  ngOnInit() {}
}
