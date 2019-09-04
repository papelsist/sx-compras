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
import { MatTableDataSource, MatSort } from '@angular/material';

import * as _ from 'lodash';

import { CuentaPorPagar } from '../../model/cuentaPorPagar';

@Component({
  selector: 'sx-cxp-facturas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cxp-facturas-table.component.html',
  styleUrls: ['./cxp-facturas-table.component.scss']
})
export class CxpFacturasTableComponent implements OnInit, OnChanges {
  @Input()
  facturas: CuentaPorPagar[] = [];
  @Input()
  multipleSelection = true;
  dataSource = new MatTableDataSource<CuentaPorPagar>([]);

  displayColumns = [
    // 'tipo',
    'nombre',
    'serie',
    'folio',
    'fecha',
    'moneda',
    'tipoDeCambio',
    'total',
    'importePorPagar',
    'saldo',
    'uuid'
  ];
  @ViewChild(MatSort)
  sort: MatSort;

  @Output()
  select = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.facturas && changes.facturas.currentValue) {
      this.dataSource.data = changes.facturas.currentValue;
    }
  }

  toogleSelect(event: CuentaPorPagar) {
    if (this.multipleSelection) {
      event.selected = !event.selected;
      const data = this.facturas.filter(item => item.selected);
      this.select.emit([...data]);
    } else {
      event.selected = !event.selected;
      this.facturas.forEach(item => {
        if (item.id !== event.id) {
          item.selected = false;
        }
      });
      this.select.emit([event]);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getTotal(property: string) {
    return _.sumBy(this.dataSource.filteredData, property);
  }
}
