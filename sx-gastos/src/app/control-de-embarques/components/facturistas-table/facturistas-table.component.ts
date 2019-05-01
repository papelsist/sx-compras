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

import { FacturistaDeEmbarque } from '../../model';

import * as _ from 'lodash';

@Component({
  selector: 'sx-facturistas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facturistas-table.component.html',
  styleUrls: ['./facturistas-table.component.scss']
})
export class FacturistasTableComponent implements OnInit, OnChanges {
  @Input()
  facturistas: FacturistaDeEmbarque[] = [];

  @Input()
  filter;

  dataSource = new MatTableDataSource<FacturistaDeEmbarque>([]);

  displayColumns = [
    'nombre',
    'rfc',
    'email',
    'telefono',
    'lastUpdated',
    'updateUser'
    // 'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  edit = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.facturistas && changes.facturistas.currentValue) {
      this.dataSource.data = changes.facturistas.currentValue;
    }
    if (changes.filter) {
      const f: string = changes.filter.currentValue || '';
      this.dataSource.filter = f.toLowerCase();
    }
  }
}
