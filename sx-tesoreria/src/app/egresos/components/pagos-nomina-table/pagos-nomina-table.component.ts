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

import { PagoDeNomina } from '../../models';

@Component({
  selector: 'sx-pagos-nomina-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagos-nomina-table.component.html',
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
export class PagosNominaTableComponent implements OnInit, OnChanges {
  @Input()
  pagos: PagoDeNomina[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<PagoDeNomina>([]);

  @Input()
  selected: PagoDeNomina;

  displayColumns = [
    'id',
    'ejercicio',
    'tipo',
    'periodicidad',
    'folio',
    'formaDePago',
    'afavor',
    'pago',
    'total',
    'egreso',
    'referencia',
    'updateUser'
    // 'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  select = new EventEmitter();

  @Output()
  pagar = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pagos && changes.pagos.currentValue) {
      this.dataSource.data = changes.pagos.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  doDelete(event: Event, row: PagoDeNomina) {
    event.stopPropagation();
    this.delete.emit(row);
  }

  doPagar(event: Event, row: PagoDeNomina) {
    event.stopPropagation();
    this.pagar.emit(row);
  }

  toggle(row: PagoDeNomina) {
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
