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

import { SolicitudDeDeposito } from '../../models';

@Component({
  selector: 'sx-solicitudes-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitudes-table.component.html',
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
export class SolicitudesTableComponent implements OnInit, OnChanges {
  @Input()
  solicitudes: SolicitudDeDeposito[] = [];

  @Input()
  filter: string;

  dataSource = new MatTableDataSource<SolicitudDeDeposito>([]);

  displayColumns = [
    'tipo',
    'sucursal',
    'folio',
    'nombre',
    'fecha',
    'total',
    'fechaDeposito',
    'comentario',
    'updateUser',
    'lastUpdated',
    'status',
    'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  edit = new EventEmitter();

  @Output()
  select = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.solicitudes && changes.solicitudes.currentValue) {
      this.dataSource.data = changes.solicitudes.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  doEdit(event: Event, row: SolicitudDeDeposito) {
    event.stopPropagation();
    this.edit.emit(row);
  }

  doSelect(event: Event, row: SolicitudDeDeposito) {
    event.stopPropagation();
    this.select.emit(row);
  }
}
