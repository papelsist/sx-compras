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

import { Cfdi } from '../../models';

import * as _ from 'lodash';

@Component({
  selector: 'sx-cfdis-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cfdis-table.component.html',
  styleUrls: ['./cfdis-table.component.scss']
})
export class CfdisTableComponent implements OnInit, OnChanges {
  @Input()
  comprobantes: Cfdi[] = [];

  @Input()
  filter;

  @Input()
  selected: Cfdi[] = [];

  dataSource = new MatTableDataSource<Cfdi>([]);

  @Input() displayColumns = [
    'receptor',
    'receptorRfc',
    'serie',
    'folio',
    'fecha',
    'total',
    'moneda',
    'tipoDeCambio',
    'origen',
    'uuid',
    'status',
    'comentario',
    'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  xml = new EventEmitter();

  @Output()
  pdf = new EventEmitter();

  @Output()
  select = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.comprobantes && changes.comprobantes.currentValue) {
      this.dataSource.data = changes.comprobantes.currentValue;
    }
    if (changes.filter) {
      const search = changes.filter.currentValue || '';
      this.dataSource.filter = search.toLowerCase();
    }
  }

  toogleSelect(event: Cfdi) {
    if (this.isSelected(event)) {
      const res = this.selected.filter(item => item.id !== event.id);
      this.select.emit(res);
    } else {
      const res = [...this.selected, event];
      this.select.emit(res);
    }
  }

  onPdf(event: Event, cfdi: Cfdi) {
    event.stopPropagation();
    this.pdf.emit(cfdi);
  }

  onXml(event: Event, cfdi: Cfdi) {
    event.stopPropagation();
    this.xml.emit(cfdi);
  }

  getTotal(property: string) {
    return _.sumBy(this.dataSource.filteredData, property);
  }

  isSelected(cfdi: Cfdi) {
    return this.selected.find(item => item.id === cfdi.id);
  }
}
