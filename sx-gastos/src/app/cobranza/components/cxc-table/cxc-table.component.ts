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

import { CuentaPorCobrar } from '../../models';

import * as _ from 'lodash';
import { PagosUtils } from 'app/_core/services/pagos-utils.service';

@Component({
  selector: 'sx-cxc-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cxc-table.component.html',
  styleUrls: ['./cxc-table.component.scss']
})
export class CxCTableComponent implements OnInit, OnChanges {
  @Input()
  cuentas: CuentaPorCobrar[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<CuentaPorCobrar>([]);

  @Input()
  displayColumns = [
    'sucursal',
    'nombre',
    'tipo',
    'tipoDocumento',
    'fecha',
    'documento',
    'moneda',
    'total',
    'cobros',
    'saldo',
    'atraso'
  ];
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @Output()
  print = new EventEmitter();
  @Output()
  select = new EventEmitter<CuentaPorCobrar[]>();
  @Output()
  edit = new EventEmitter<CuentaPorCobrar>();
  @Output()
  delete = new EventEmitter<CuentaPorCobrar>();

  constructor(private pagosUtils: PagosUtils) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.cuentas && changes.cuentas.currentValue) {
      this.dataSource.data = changes.cuentas.currentValue;
      // console.log('Pendientes: ', changes.cuentas.currentValue);
    }
    if (changes.filter) {
      const text = changes.filter.currentValue
        ? changes.filter.currentValue
        : '';
      this.dataSource.filter = text.toLowerCase();
    }
  }
  toogleSelect(event: CuentaPorCobrar) {
    event.selected = !event.selected;
    const data = this.cuentas.filter(item => item.selected);
    this.select.emit([...data]);
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }

  getTotal(property: string) {
    return _.sumBy(this.dataSource.filteredData, property);
  }

  getFormaDePago(cxp: CuentaPorCobrar) {
    return this.pagosUtils.slim(cxp.formaDePago);
  }
}
