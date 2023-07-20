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

import { PagoDeMorralla } from '../../models';

@Component({
  selector: 'sx-pago-morrallas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pago-morrallas-table.component.html',
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
export class PagoMorrallasTableComponent implements OnInit, OnChanges {
  @Input()
  pagos: PagoDeMorralla[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<PagoDeMorralla>([]);

  @Input()
  selected: PagoDeMorralla;

  displayColumns = [
    'id',
    'fecha',
    'origen',
    'destino',
    'formaDePago',
    'importe',
    'referencia',
    'updateUser'
    // 'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  select = new EventEmitter();

  @Output()
  pagar = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pagos && changes.pagos.currentValue) {
      this.dataSource.data = changes.pagos.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  doDelete(event: Event, row: PagoDeMorralla) {
    event.stopPropagation();
    this.delete.emit(row);
  }

  doPagar(event: Event, row: PagoDeMorralla) {
    event.stopPropagation();
    this.pagar.emit(row);
  }

  toggle(row: PagoDeMorralla) {
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
