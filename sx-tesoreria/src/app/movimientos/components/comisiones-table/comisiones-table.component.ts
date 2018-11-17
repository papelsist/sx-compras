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

import { Comision } from '../../models';

@Component({
  selector: 'sx-comisiones-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comisiones-table.component.html',
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
export class ComisionesTableComponent implements OnInit, OnChanges {
  @Input()
  comisiones: Comision[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<Comision>([]);

  @Input()
  selected: Comision;

  displayColumns = [
    'id',
    'fecha',
    'banco',
    'cuentaNumero',
    'comision',
    'impuesto',
    'factura',
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
    if (changes.comisiones && changes.comisiones.currentValue) {
      this.dataSource.data = changes.comisiones.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  doDelete(event: Event, row: Comision) {
    event.stopPropagation();
    this.delete.emit(row);
  }

  doEdit(event: Event, row: Comision) {
    event.stopPropagation();
    this.edit.emit(row);
  }

  toggle(row: Comision) {
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
