import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material';

import { ListaDePreciosProveedorDet } from '../../models/listaDePreciosProveedorDet';
import { aplicarDescuentosEnCascada } from 'app/utils/money-utils';

@Component({
  selector: 'sx-proveedor-lista-partidas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-lista-partidas.component.html',
  styleUrls: ['./proveedor-lista-partidas.component.scss']
})
export class ProveedorListaPartidasComponent implements OnInit {
  @Input() partidas: ListaDePreciosProveedorDet[] = [];
  @Input() parent: FormGroup;
  @Input() readOnly = false;
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();

  displayColumns = [
    'clave',
    'descripcion',
    'unidad',
    // 'moneda',
    'precioAnterior',
    'precioBruto',
    'diferencia',
    'desc1',
    'desc2',
    'desc3',
    'desc4',
    'precioNeto',
    'operaciones'
  ];

  @ViewChild('table') table: MatTable<any>;

  constructor() {}

  ngOnInit() {}

  refresh() {
    this.table.renderRows();
  }

  asignarPrecio(precio, row: ListaDePreciosProveedorDet) {
    row.precioBruto = parseFloat(precio);
    this.actualizar(row);
  }

  actualizar(row: ListaDePreciosProveedorDet) {
    const { unidad, precioBruto, desc1, desc2, desc3, desc4 } = row;
    const importeNeto = aplicarDescuentosEnCascada(precioBruto, [
      desc1,
      desc2,
      desc3,
      desc4
    ]);
    row.precioNeto = importeNeto;
    this.update.emit(row);
  }

  getDirerencia(row: ListaDePreciosProveedorDet) {
    if (row.precioBruto <= 0) {
      return 0;
    }
    const dif = row.precioBruto - row.precioAnterior;
    return dif / row.precioBruto;
  }
}
