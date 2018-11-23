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
import { CuentaPorPagar } from '../../model';

@Component({
  selector: 'sx-facturas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facturas-table.component.html',
  styleUrls: ['./facturas-table.component.scss']
})
export class FacturasTableComponent implements OnInit, OnChanges {
  @Input()
  facturas: CuentaPorPagar[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<CuentaPorPagar>([]);

  @Input()
  displayColumns = [
    'nombre',
    'tipo',
    'serie',
    'folio',
    'fecha',
    // 'moneda',
    // 'tipoDeCambio',
    // 'tcContable',
    'total',
    'importePorPagar',
    'saldo',
    'metodoDePago',
    // 'formaDePago',
    'usoCfdi',
    'tipoDeComprobante',
    'versionCfdi',
    'uuid',
    'operaciones'
  ];
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  select = new EventEmitter();
  @Output()
  edit = new EventEmitter();

  @Output()
  pdf = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.facturas && changes.facturas.currentValue) {
      this.dataSource.data = changes.facturas.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  toogleSelect(event: CuentaPorPagar) {
    event.selected = !event.selected;
    const data = this.facturas.filter(item => item.selected);
    this.select.emit([...data]);
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }

  getTotal(property: string) {
    return _.sumBy(this.dataSource.filteredData, property);
  }
}
