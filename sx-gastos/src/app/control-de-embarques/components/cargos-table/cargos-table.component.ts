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

import { FacturistaCargo } from '../../model';

import * as _ from 'lodash';

@Component({
  selector: 'sx-cargos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cargos-table.component.html',
  styleUrls: ['./cargos-table.component.scss']
})
export class CargosTableComponent implements OnInit, OnChanges {
  @Input()
  cargos: FacturistaCargo[] = [];

  @Input()
  filter;

  dataSource = new MatTableDataSource<FacturistaCargo>([]);

  displayColumns = [
    'id',
    'nombre',
    'tipo',
    'fecha',
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
    if (changes.cargos && changes.cargos.currentValue) {
      this.dataSource.data = changes.cargos.currentValue;
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
