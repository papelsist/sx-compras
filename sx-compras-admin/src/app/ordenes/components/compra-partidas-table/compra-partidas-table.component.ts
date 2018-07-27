import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material';

import { aplicarDescuentosEnCascada } from 'app/utils/money-utils';
import { CompraDet } from '../../models/compraDet';

@Component({
  selector: 'sx-compra-partidas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compra-partidas-table.component.html',
  styleUrls: ['./compra-partidas-table.component.scss']
})
export class CompraPartidasTableComponent implements OnInit, OnChanges {
  @Input() partidas: CompraDet[] = [];
  @Input() parent: FormGroup;
  @Input() readOnly = false;
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();

  displayColumns = [
    'clave',
    'descripcion',
    'unidad',
    'solicitado',
    'precio',
    'descuento1',
    'descuento2',
    'descuento3',
    'descuento4',
    'importeNeto',
    'operaciones'
  ];

  dataSource = new MatTableDataSource<CompraDet>([]);

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      this.dataSource.data = changes.partidas.currentValue;
    }
  }

  actualizar(row: CompraDet) {
    console.log('Actualizando: ', row);
    const {
      producto,
      solicitado,
      precio,
      descuento1,
      descuento2,
      descuento3,
      descuento4
    } = row;
    const factor = producto.unidad === 'MIL' ? 1000 : 1;
    const importeBruto = precio * (solicitado / factor);
    const importeNeto = aplicarDescuentosEnCascada(precio, [
      descuento1,
      descuento2,
      descuento3,
      descuento4
    ]);
    row.importeBruto = importeBruto;
    row.importeNeto = importeNeto;
    this.update.emit(row);
  }
}
