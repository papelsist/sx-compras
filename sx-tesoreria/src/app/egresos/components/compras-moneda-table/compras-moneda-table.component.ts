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

import { CompraMoneda } from '../../models';

@Component({
  selector: 'sx-compras-moneda-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compras-moneda-table.component.html',
  styles: [
    `
      table {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      .mat-cell {
        font-size: 11px;
      }
      .mat-row {
        height: 30px;
      }
    `
  ]
})
export class ComprasMonedaTableComponent implements OnInit, OnChanges {
  @Input()
  compras: CompraMoneda[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<CompraMoneda>([]);

  @Input()
  selected: CompraMoneda;

  displayColumns = [
    'id',
    'fecha',
    'origen',
    'destino',
    'afavor',
    'moneda',
    'importe',
    'tipoDeCambio',
    'tipoDeCambioCompra',
    // 'diferenciaCambiaria',
    'referencia',
    'factura',
    'updateUser',
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
  lookupFactura = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.compras && changes.compras.currentValue) {
      this.dataSource.data = changes.compras.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  doDelete(event: Event, row: CompraMoneda) {
    event.stopPropagation();
    this.delete.emit(row);
  }

  doEdit(event: Event, row: CompraMoneda) {
    event.stopPropagation();
    this.edit.emit(row);
  }

  doLookupFactura(event: Event, row: CompraMoneda) {
    event.stopPropagation();
    this.lookupFactura.emit(row);
  }

  toggle(row: CompraMoneda) {
    if (!this.selected) {
      this.select.emit(row);
    } else {
      if (this.selected.id === row.id) {
        this.select.emit(undefined);
      } else {
        this.select.emit(row);
      }
    }
  }
}
