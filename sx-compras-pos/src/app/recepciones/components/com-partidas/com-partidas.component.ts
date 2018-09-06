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
import { MatTableDataSource, MatTable } from '@angular/material';

import { RecepcionDeCompraDet } from '../../models/recepcionDeCompraDet';

@Component({
  selector: 'sx-com-partidas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './com-partidas.component.html',
  styleUrls: ['./com-partidas.component.scss']
})
export class ComPartidasComponent implements OnInit, OnChanges {
  @Input() partidas: RecepcionDeCompraDet[] = [];
  @Input() parent: FormGroup;
  @Input() readOnly: false;

  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();

  displayColumns = [
    'clave',
    'descripcion',
    'unidad',
    'solicitado',
    'cantidad',
    // 'precio',
    // 'descuento1',
    // 'descuento2',
    // 'descuento3',
    // 'descuento4',
    // 'importeNeto',
    'operaciones'
  ];

  dataSource = new MatTableDataSource<RecepcionDeCompraDet>([]);

  @ViewChild(MatTable) table: MatTable<any>;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      this.dataSource.data = changes.partidas.currentValue;
    }
  }

  actualizar(row: RecepcionDeCompraDet) {
    this.update.emit(row);
  }

  refresh() {
    this.table.renderRows();
  }
}
