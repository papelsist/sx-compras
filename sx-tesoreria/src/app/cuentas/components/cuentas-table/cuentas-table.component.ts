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

import { CuentaDeBanco } from 'app/models';

@Component({
  selector: 'sx-cuentas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cuentas-table.component.html',
  styleUrls: ['./cuentas-table.component.scss']
})
export class CuentasTableComponent implements OnInit, OnChanges {
  @Input()
  cuentas: CuentaDeBanco[] = [];

  @Input()
  selectedId: string;

  @Input()
  filter;

  dataSource = new MatTableDataSource<CuentaDeBanco>([]);

  displayColumns = [
    'numero',
    'clave',
    'descripcion',
    'banco',
    'moneda',
    'lastUpdated',
    'updateUser',
    'operaciones'
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
    if (changes.cuentas && changes.cuentas.currentValue) {
      this.dataSource.data = changes.cuentas.currentValue;
    }
    if (changes.filter) {
      const f: string = changes.filter.currentValue || '';
      this.dataSource.filter = f.toLowerCase();
    }
  }
  doEdit(event: Event, cuenta: CuentaDeBanco) {
    event.stopPropagation();
    this.edit.emit(cuenta);
  }
}
