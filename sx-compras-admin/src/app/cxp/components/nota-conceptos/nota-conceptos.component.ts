import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { NotaDeCreditoCxPDet } from '../../model';

import * as _ from 'lodash';

@Component({
  selector: 'sx-nota-conceptos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nota-conceptos.component.html',
  styleUrls: ['./nota-conceptos.component.scss']
})
export class NotaConceptosComponent implements OnInit, OnChanges {
  @Input() conceptos: NotaDeCreditoCxPDet[] = [];

  @Output() info = new EventEmitter();
  @Input() filter;

  displayColumns = [
    'uuid',
    'serie',
    'folio',
    'fecha',
    'moneda',
    'tipoDeCambio',
    'total',
    'pagos',
    'saldo',
    'analizado',
    'pagado',
    'aplicable',
    'operaciones'
  ];

  dataSource = new MatTableDataSource<NotaDeCreditoCxPDet>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.conceptos && changes.conceptos.currentValue) {
      this.dataSource.data = changes.conceptos.currentValue;
    }
    if (changes.filter && changes.filter.currentValue) {
      this.dataSource.filter = changes.filter.currentValue;
    }
  }

  getTotal(property: string) {
    return _.sumBy(this.dataSource.filteredData, property);
  }
}
