import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { FacturistaPrestamo } from '../../model';

import * as _ from 'lodash';

@Component({
  selector: 'sx-prestamos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prestamos-table.component.html',
  styleUrls: ['./prestamos-table.component.scss']
})
export class PrestamosTableComponent implements OnInit, OnChanges {
  @Input()
  prestamos: FacturistaPrestamo[] = [];

  @Input()
  filter;

  dataSource = new MatTableDataSource<FacturistaPrestamo>([]);

  displayColumns = [
    'id',
    'nombre',
    'tipo',
    'fecha',
    'autorizacion',
    'autorizo',
    'importe',
    'cobros',
    'saldo',
    'comentario',
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

  initialSelection = [];

  total = 0.0;
  cobros = 0.0;
  saldo = 0.0;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.prestamos && changes.prestamos.currentValue) {
      this.dataSource.data = changes.prestamos.currentValue;
      this.actuailizar();
    }
    if (changes.filter) {
      const f: string = changes.filter.currentValue || '';
      this.dataSource.filter = f.toLowerCase();
      this.actuailizar();
    }
  }

  actuailizar() {
    this.total = _.sumBy(this.dataSource.filteredData, 'importe');
    this.cobros = _.sumBy(this.dataSource.filteredData, 'cobros');
    this.saldo = _.sumBy(this.dataSource.filteredData, 'saldo');
  }
}
