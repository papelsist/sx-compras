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

import { ComprobanteFiscalConcepto } from '../../model';

@Component({
  selector: 'sx-cfdis-conceptos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cfdi-conceptos-table.component.html',
  styleUrls: ['./cfdi-conceptos-table.component.scss']
})
export class CfdisConceptosTableComponent implements OnInit, OnChanges {
  @Input()
  conceptos: ComprobanteFiscalConcepto[] = [];

  @Input()
  filter;

  dataSource = new MatTableDataSource<ComprobanteFiscalConcepto>([]);

  displayColumns = [
    'claveProdServ',
    'claveUnidad',
    'unidad',
    'descripcion',
    'cantidad',
    'valorUnitario',
    'importe'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.conceptos && changes.conceptos.currentValue) {
      this.dataSource.data = changes.conceptos.currentValue;
    }
    if (changes.filter) {
      const search = changes.filter.currentValue || '';
      this.dataSource.filter = search.toLowerCase();
    }
  }

  getTotal(property: string) {
    return _.sumBy(this.dataSource.filteredData, property);
  }
}
