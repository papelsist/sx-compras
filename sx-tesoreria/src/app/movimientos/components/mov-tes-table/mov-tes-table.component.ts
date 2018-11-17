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

import { MovimientoDeTesoreria } from '../../models';

@Component({
  selector: 'sx-mov-tes-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mov-tes-table.component.html',
  styles: [
    `
      table {
        width: 100%;
        max-height: 500px;
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
export class MovTesTableComponent implements OnInit, OnChanges {
  @Input()
  movimientos: MovimientoDeTesoreria[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<MovimientoDeTesoreria>([]);

  @Input()
  selected: MovimientoDeTesoreria;

  displayColumns = [
    'id',
    'fecha',
    'banco',
    'cuentaNumero',
    'concepto',
    'importe',
    'referencia',
    'comentario',
    'updateUser',
    'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  select = new EventEmitter();

  @Output()
  edit = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.movimientos && changes.movimientos.currentValue) {
      this.dataSource.data = changes.movimientos.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  doDelete(event: Event, row: MovimientoDeTesoreria) {
    event.stopPropagation();
    this.delete.emit(row);
  }

  toggle(row: MovimientoDeTesoreria) {
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
}
