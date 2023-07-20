import { Component, OnInit, Input } from '@angular/core';
import { ComprasFilter } from '../../models/compra';

@Component({
  selector: 'sx-compras-filter-label',
  template: `
  <div layout layout-align="center center" class="pad-bottom text-sm tc-indigo-500">
    <span *ngIf="!filter.pendientes; else pendienteLabel">
      <span *ngIf="filter.proveedor" >{{filter.proveedor.nombre}}</span>
      <span *ngIf="filter.fechaInicial" class="pad-left">Del: {{changeDate(filter.fechaInicial) | date: 'dd/MM/yyyy'}}</span>
      <span *ngIf="filter.fechaFinal" class="pad-left">al: {{changeDate(filter.fechaFinal) | date: 'dd/MM/yyyy'}}</span>
    </span>
    <ng-template #pendienteLabel>
    <span class="pad-left tc-pink-600">(Pendientes)</span>
    </ng-template>
  <div>
  `
})
export class ComprasFilterLabelComponent implements OnInit {
  @Input()
  filter: ComprasFilter;
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
