import { Component, OnInit, Input } from '@angular/core';
import { RembolsosFilter } from '../../models';

@Component({
  selector: 'sx-rembolsos-filter-label',
  template: `
  <div layout layout-align="center center" class="pad-bottom text-sm tc-indigo-500">
    <span *ngIf="filter.sucursal" >{{filter.sucursal.nombre}}</span>
    <span *ngIf="filter.fechaInicial" class="pad-left">Del: {{filter.fechaInicial | date: 'dd/MM/yyyy'}}</span>
    <span *ngIf="filter.fechaFinal" class="pad-left">al: {{filter.fechaFinal | date: 'dd/MM/yyyy'}}</span>
  <div>
  `
})
export class RembolsosFilterLabelComponent implements OnInit {
  @Input()
  filter: RembolsosFilter;
  constructor() {}

  ngOnInit() {}
}
