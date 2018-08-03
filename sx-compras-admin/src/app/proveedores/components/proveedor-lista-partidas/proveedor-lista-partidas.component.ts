import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { ListaDePreciosProveedorDet } from '../../models/listaDePreciosProveedorDet';
import { aplicarDescuentosEnCascada } from 'app/utils/money-utils';

@Component({
  selector: 'sx-proveedor-lista-partidas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-lista-partidas.component.html',
  styleUrls: ['./proveedor-lista-partidas.component.scss']
})
export class ProveedorListaPartidasComponent implements OnInit, OnChanges {
  dataSource = new MatTableDataSource<ListaDePreciosProveedorDet>([]);
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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() filter;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      this.dataSource.data = changes.partidas.currentValue;
    }
    if (changes.filter) {
      this.dataSource.filter = changes.filter.currentValue;
    }
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
