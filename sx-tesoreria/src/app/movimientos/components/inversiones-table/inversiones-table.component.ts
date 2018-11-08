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

import { Inversion } from '../../models';

@Component({
  selector: 'sx-inversiones-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inversiones-table.component.html',
  styles: [
    `
      table {
        width: 100%;
        max-height: 500px;
        overflow: auto;
      }
      .mat-column-tipo {
        width: 50px;
      }
      .mat-column-fecha,
      .mat-column-formaDePago {
        width: 90px;
      }
      .mat-column-nombre {
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .mat-column-comentario {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
export class InversionesTableComponent implements OnInit, OnChanges {
  @Input()
  inversiones: Inversion[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<Inversion>([]);

  @Input()
  selected: Inversion;

  displayColumns = [
    'id',
    'destino',
    'origen',
    'importe',
    'fecha',
    'plazo',
    'vencimiento',
    'tasa',
    // 'moneda',
    'rendimientoCalculado',
    'rendimientoReal',
    'referencia',
    // 'comentario',
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
  delete = new EventEmitter();

  @Output()
  retorno = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inversiones && changes.inversiones.currentValue) {
      this.dataSource.data = changes.inversiones.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  doDelete(event: Event, row: Inversion) {
    event.stopPropagation();
    this.delete.emit(row);
  }

  doRetorno(event: Event, row: Inversion) {
    event.stopPropagation();
    this.retorno.emit(row);
  }

  toggle(row: Inversion) {
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
