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

import { Cfdi, CfdiCancelado } from '../../models';

import * as _ from 'lodash';

@Component({
  selector: 'sx-cancelaciones-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cancelaciones-table.component.html',
  styleUrls: ['./cancelaciones-table.component.scss']
})
export class CancelacionesTableComponent implements OnInit, OnChanges {
  @Input()
  cancelaciones: CfdiCancelado[] = [];

  @Input()
  filter;

  dataSource = new MatTableDataSource<Cfdi>([]);

  @Input() displayColumns = [
    'receptor',
    'serie',
    'folio',
    'tipo',
    'fecha',
    'total',
    'uuid',
    'status',
    'statusCode',
    'isCancelable',
    'cancelStatus',
    'creado',
    'actualizado',
    'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  ack = new EventEmitter();

  @Output()
  download = new EventEmitter();

  @Output()
  select = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cancelaciones && changes.cancelaciones.currentValue) {
      this.dataSource.data = changes.cancelaciones.currentValue;
    }
    if (changes.filter) {
      const search = changes.filter.currentValue || '';
      this.dataSource.filter = search.toLowerCase();
    }
  }

  onAcuse(event: Event, cfdi: Cfdi) {
    event.stopPropagation();
    this.ack.emit(cfdi);
  }

  onDownload(event: Event, cfdi: Cfdi) {
    event.stopPropagation();
    this.download.emit(cfdi);
  }
}
