import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';

@Component({
  selector: 'sx-factura-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './factura-selector.component.html',
  styles: [
    `
    .facturas-table-panel {
      max-height: 500px;
      overflow: auto;
    }
  `
  ]
})
export class FacturaSelectorComponent implements OnInit {
  facturas: any[];
  title: string;
  selected: CuentaPorPagar[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.facturas = data.facturas;
    this.title = data.title || 'Selector de facturas';
    this.selected = data.selected || undefined;
  }

  ngOnInit() {}

  onSelection(event: CuentaPorPagar[]) {
    this.selected = event;
  }
}
