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

import { Cobro } from '../../models';

@Component({
  selector: 'sx-cobros-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cobros-table.component.html',
  styles: [
    `
      table {
        width: 100%;
        max-height: 500px;
        overflow: auto;
      }
      .mat-column-requisicion,
      .mat-column-folio {
        max-width: 50px;
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
export class CobrosTableComponent implements OnInit, OnChanges {
  @Input()
  cobros: Cobro[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<Cobro>([]);

  displayColumns = [
    'tipo',
    'fecha',
    'nombre',
    'comentario',
    'formaDePago',
    'moneda',
    'importe',
    'disponible',
    'referencia',
    'updateUser',
    'modificado'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  edit = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cobros && changes.cobros.currentValue) {
      this.dataSource.data = changes.cobros.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }
}
