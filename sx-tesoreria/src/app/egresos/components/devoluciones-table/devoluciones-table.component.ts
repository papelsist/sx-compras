import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { DevolucionCliente } from '../../models';

@Component({
  selector: 'sx-devoluciones-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './devoluciones-table.component.html',
  styles: [
    `
      table {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      .mat-cell {
        font-size: 11px;
      }
      .mat-row {
        height: 30px;
      }
    `
  ]
})
export class DevolucionesTableComponent implements OnInit, OnChanges {
  @Input()
  devoluciones: DevolucionCliente[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<DevolucionCliente>([]);

  @Input()
  selected: DevolucionCliente;

  displayColumns = [
    'id',
    'formaDePago',
    'fecha',
    'concepto',
    'afavor',
    'cuenta',
    'cobro',
    'importe',
    'referencia',
    'comentario',
    'updateUser'
    // 'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  select = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.devoluciones && changes.devoluciones.currentValue) {
      this.dataSource.data = changes.devoluciones.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  toggle(row: DevolucionCliente) {
    if (!this.selected) {
      this.select.emit(row);
    } else {
      if (this.selected.id === row.id) {
        this.select.emit(undefined);
      } else {
        this.select.emit(row);
      }
    }
  }
  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
