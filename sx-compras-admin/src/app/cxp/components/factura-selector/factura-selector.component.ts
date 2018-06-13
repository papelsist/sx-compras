import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sx-factura-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './factura-selector.component.html'
})
export class FacturaSelectorComponent implements OnInit {
  facturas: any[];
  title: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.facturas = data.facturas;
    this.title = data.title || 'Selector de facturas';
  }

  ngOnInit() {}
}
