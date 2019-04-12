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

import { NotaDeCargo } from 'app/cobranza/models';
import * as _ from 'lodash';

@Component({
  selector: 'sx-notas-de-cargo-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notas-de-cargo-table.component.html',
  styleUrls: ['./notas-de-cargo-table.component.scss']
})
export class NotasDeCargoTableComponent implements OnInit, OnChanges {
  @Input()
  notas: NotaDeCargo[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<NotaDeCargo>([]);

  @Input()
  displayColumns = [
    'folio',
    // 'nombre',
    'tipo',
    'fecha',
    'moneda',
    'tipoDeCambio',
    'total',
    'cobros',
    'saldo',
    'cfdi',
    'comentario'
    // 'operaciones'
  ];
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  print = new EventEmitter();

  @Output()
  select = new EventEmitter<NotaDeCargo[]>();

  @Output()
  edit = new EventEmitter<NotaDeCargo>();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.notas && changes.notas.currentValue) {
      this.dataSource.data = changes.notas.currentValue;
      // console.log('Pendientes: ', changes.notas.currentValue);
    }
    if (changes.filter) {
      const text = changes.filter.currentValue
        ? changes.filter.currentValue
        : '';
      this.dataSource.filter = text.toLowerCase();
    }
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }

  getTotal(property: string) {
    return _.sumBy(this.dataSource.filteredData, property);
  }
}
