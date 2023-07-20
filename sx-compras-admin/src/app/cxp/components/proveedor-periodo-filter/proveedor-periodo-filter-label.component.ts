import { Component, OnInit, Input } from '@angular/core';
import { ProveedorPeriodoFilter } from 'app/cxp/model/proveedorPeriodoFilter';

@Component({
  selector: 'sx-proveedor-periodo-filter-label',
  template: `
  <div layout layout-align="center center" class="pad-bottom text-sm tc-indigo-500">
    <span>
      <span *ngIf="filter.proveedor" >{{filter.proveedor.nombre}}</span>
      <span *ngIf="filter.fechaInicial" class="pad-left">Del: {{filter.fechaInicial | date: 'dd/MM/yyyy'}}</span>
      <span *ngIf="filter.fechaFinal" class="pad-left">al: {{filter.fechaFinal | date: 'dd/MM/yyyy'}}</span>
    </span>
  <div>
  `
})
export class ProveedorPeriodoFilterLabelComponent implements OnInit {
  @Input()
  filter: ProveedorPeriodoFilter;
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
