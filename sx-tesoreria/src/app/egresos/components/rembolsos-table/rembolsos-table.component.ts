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

import { Rembolso } from '../../models';

@Component({
  selector: 'sx-rembolsos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rembolsos-table.component.html',
  styleUrls: ['./rembolsos-table.component.scss']
})
export class RembolsosTableComponent implements OnInit, OnChanges {
  @Input()
  rembolsos: Rembolso[] = [];
  @Input()
  filter;

  dataSource = new MatTableDataSource<Rembolso>([]);

  displayColumns = [
    'folio',
    'nombre',
    'fecha',
    'fechaDePago',
    'total',
    'status',
    'comentario',
    'operaciones'
  ];
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @Output()
  print = new EventEmitter();
  @Output()
  select = new EventEmitter();
  @Output()
  edit = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.rembolsos && changes.rembolsos.currentValue) {
      this.dataSource.data = changes.rembolsos.currentValue;
    }
    if (changes.filter) {
      const f: string = changes.filter.currentValue || '';
      this.dataSource.filter = f.toLowerCase();
    }
  }
  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
