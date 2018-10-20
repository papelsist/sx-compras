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

import { Requisicion } from '../../models';
import { PagosUtils } from '../../../_core/services/pagos-utils.service';

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
    'formaDePago',
    'moneda',
    'tipoDeCambio',
    'total',
    'pagada',
    // 'egresoReferencia',
    'comentario',
    'reciboDePago',
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
  constructor(private pagoUtils: PagosUtils) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.folio.toString().startsWith(filter);
    };
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

  getFormaDePago(row: Requisicion) {
    return this.pagoUtils.slim(row.formaDePago);
  }
}
