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

import { Requisicion } from '../../model';

@Component({
  selector: 'sx-requisiciones-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './requisiciones-table.component.html',
  styleUrls: ['./requisiciones-table.component.scss']
})
export class RequisicionesTableComponent implements OnInit, OnChanges {
  @Input()
  comprobantes: Requisicion[] = [];
  @Input()
  filter;

  dataSource = new MatTableDataSource<Requisicion>([]);

  displayColumns = [
    'folio',
    'nombre',
    'fecha',
    'fechaDePago',
    'moneda',
    'tipoDeCambio',
    'total',
    'apagar',
    'cerrada',
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
    if (changes.comprobantes && changes.comprobantes.currentValue) {
      this.dataSource.data = changes.comprobantes.currentValue;
    }
    if (changes.filter) {
      const f: string = changes.filter.currentValue || '';
      this.dataSource.filter = f.toLowerCase();
    }
  }

  toogleSelect(event: Requisicion) {
    event.selected = !event.selected;
    const data = this.comprobantes.filter(item => item.selected);
    this.select.emit([...data]);
  }
}
