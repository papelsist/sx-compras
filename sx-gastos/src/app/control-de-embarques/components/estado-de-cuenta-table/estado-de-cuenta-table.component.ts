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

import * as _ from 'lodash';
import { FacturistaEstadoDeCuenta } from 'app/control-de-embarques/model';

@Component({
  selector: 'sx-estado-de-cuenta-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './estado-de-cuenta-table.component.html',
  styles: [
    `
      table {
        width: 100%;
        // min-height: 200px;
        // max-height: 500px;
        overflow: auto;
      }
      .mat-column-requisicion,
      .mat-column-folio {
        max-width: 50px;
      }
      .mat-cell {
        font-size: 12px;
      }
      .mat-row {
        height: 30px;
      }
      .mat-footer-row {
        height: 30px;
        font-size: 11px;
        font-weight: bold;
        font-style: italic;
      }
    `
  ]
})
export class EstadoDeCuentaTableComponent implements OnInit, OnChanges {
  @Input()
  movimientos: FacturistaEstadoDeCuenta[] = [];

  @Input()
  filter: string;

  dataSource = new MatTableDataSource<FacturistaEstadoDeCuenta>([]);

  @Input()
  displayColumns = [
    // 'nombre',
    'tipo',
    'concepto',
    'comentario',
    'fecha',
    'importe',
    'saldo',
    'tasaDeInteres',
    'updateUser',
    'dateCreated',
    'nota'
  ];
  @ViewChild(MatSort)
  sort: MatSort;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  select = new EventEmitter<FacturistaEstadoDeCuenta>();

  constructor() {}

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.movimientos && changes.movimientos.currentValue) {
      this.dataSource.data = changes.movimientos.currentValue;
    }
    if (changes.filter) {
      const text = changes.filter.currentValue
        ? changes.filter.currentValue
        : '';
      this.dataSource.filter = text.toLowerCase();
    }
  }

  toogleSelect(event: FacturistaEstadoDeCuenta) {
    this.select.emit(event);
  }

  getSaldo() {
    if (this.dataSource.data && this.dataSource.data.length > 0) {
      return _.last(this.dataSource.data).saldo;
    } else {
      return 0.0;
    }
  }
}
