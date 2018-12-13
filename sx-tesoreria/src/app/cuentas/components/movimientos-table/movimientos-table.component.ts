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

import { Movimiento } from 'app/cuentas/models/movimiento';

@Component({
  selector: 'sx-movimientos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movimientos-table.component.html',
  styleUrls: ['./movimientos-table.component.scss']
})
export class MovimientosTableComponent implements OnInit, OnChanges {
  @Input()
  movimientos: Movimiento[] = [];

  @Input()
  selected: Movimiento;

  @Input()
  filter;

  dataSource = new MatTableDataSource<Movimiento>([]);

  displayColumns = [
    'fecha',
    'concepto',
    'conceptoReporte',
    'importe',
    'formaDePago',
    'referencia',
    'afavor',
    'updateUser'
  ];
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @Output()
  print = new EventEmitter();
  @Output()
  select = new EventEmitter();
  @Output()
  edit = new EventEmitter();

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
      const f: string = changes.filter.currentValue || '';
      this.dataSource.filter = f.toLowerCase();
    }
  }
  doEdit(event: Event, cuenta: Movimiento) {
    event.stopPropagation();
    this.edit.emit(cuenta);
  }
}
