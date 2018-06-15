import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';

@Component({
  selector: 'sx-factura-header',
  template: `
    <span layout class="md-headline">
      <span class="tc-blue-600 pad-right">{{factura.serie}}</span>
      <span class="tc-blue-600 pad-right">{{factura.folio}}</span>
      <span>({{factura.fecha | date: 'dd/MM/yyyy'}})</span>
    </span>
  `
})
export class FacturaHeaderComponent implements OnInit {
  @Input() factura: CuentaPorPagar;
  constructor() {}

  ngOnInit() {}
}
