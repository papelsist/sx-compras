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

import { Ficha } from '../../models';

@Component({
  selector: 'sx-fichas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fichas-table.component.html',
  styles: [
    `
      table {
        width: 100%;
        max-height: 500px;
        overflow: auto;
      }
      .mat-column-fecha,
      .mat-column-formaDePago {
        width: 90px;
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
export class FichasTableComponent implements OnInit, OnChanges {
  @Input()
  fichas: Ficha[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<Ficha>([]);

  displayColumns = [
    'sucursalNombre',
    'folio',
    'fecha',
    'tipoDeFicha',
    'cuentaDeBanco',
    'total',
    'ingresoFecha',
    'modificado',
    'usuario',
    'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  edit = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  @Output()
  ingreso = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fichas && changes.fichas.currentValue) {
      this.dataSource.data = changes.fichas.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  doDelete(event: Event, row: Ficha) {
    event.stopPropagation();
    this.delete.emit(row);
  }

  doRegistrarIngreso(event: Event, row: Ficha) {
    event.stopPropagation();
    this.ingreso.emit(row);
  }
}
