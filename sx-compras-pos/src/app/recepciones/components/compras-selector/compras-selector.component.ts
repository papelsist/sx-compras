import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { MAT_DIALOG_DATA } from '@angular/material';
import { Compra } from '../../../ordenes/models/compra';
import { RecepcionDeCompraService } from '../../services';
import { catchError } from 'rxjs/operators';
import { Proveedor } from '../../../proveedores/models/proveedor';

@Component({
  selector: 'sx-factura-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compras-selector.component.html',
  styles: [
    `
      .compras-table-panel {
        min-height: 450px;
        max-height: 450px;
        overflow: auto;
      }
    `
  ]
})
export class ComprasSelectorComponent implements OnInit {
  compras$: Observable<Compra[]>;
  proveedor: Proveedor;
  search$ = new Subject<string>();
  selected: Compra;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: RecepcionDeCompraService
  ) {
    this.proveedor = data.proveedor;
  }

  ngOnInit() {
    this.compras$ = this.service.getComprasPendientes(this.proveedor.id);
  }

  onSelection(event: Compra) {
    this.selected = event;
  }

  onSearch(event: string) {
    this.search$.next(event);
  }
}
