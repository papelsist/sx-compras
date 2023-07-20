import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';
import { ComprobanteFiscalService } from '../../services';

@Component({
  selector: 'sx-factura-header',
  template: `
    <span layout class="md-headline cursor-pointer" (click)="showFactura(factura)">
      <span class="tc-blue-600 pad-right">{{factura.serie}}</span>
      <span class="tc-blue-600 pad-right">{{factura.folio}}</span>
      <span>({{changeDate(factura.fecha) | date: 'dd/MM/yyyy'}})</span>
    </span>
  `
})
export class FacturaHeaderComponent implements OnInit {
  @Input() factura: CuentaPorPagar;
  constructor(private service: ComprobanteFiscalService) {}

  ngOnInit() {}

  showFactura(event: CuentaPorPagar) {
    this.service.imprimirCfdi(event.comprobanteFiscal.id);
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
