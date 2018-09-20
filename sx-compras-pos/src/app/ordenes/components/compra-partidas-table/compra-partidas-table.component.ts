import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';

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
  @Input() cerrada;

  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() depurar = new EventEmitter();

  displayColumns = [
    'clave',
    'descripcion',
    'unidad',
    'solicitado',
    // 'precio',
    // 'descuento1',
    // 'descuento2',
    // 'descuento3',
    // 'descuento4',
    // 'importeNeto',
    'recibido',
    'depurado',
    'porRecibir',
    'operaciones'
  ];

  dataSource = new MatTableDataSource<CompraDet>([]);

  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      this.dataSource.data = changes.partidas.currentValue;
    }
  }

  actualizar(row: CompraDet) {
    this.update.emit(row);
  }

  get readOnly() {
    return this.parent.disabled;
  }

  get especial() {
    return this.parent.get('especial').value;
  }

  canDelete(det: CompraDet) {
    return !this.readOnly && det.recibido <= 0 && !this.cerrada;
  }
}
