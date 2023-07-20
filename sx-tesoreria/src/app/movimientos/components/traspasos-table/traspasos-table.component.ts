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

import { Traspaso } from '../../models/traspaso';

@Component({
  selector: 'sx-traspasos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './traspasos-table.component.html',
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
export class TraspasosTableComponent implements OnInit, OnChanges {
  @Input()
  traspasos: Traspaso[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<Traspaso>([]);

  @Input()
  selected: Traspaso;

  displayColumns = [
    'id',
    'fecha',
    'origen',
    'destino',
    'moneda',
    'importe',
    'comision',
    'referencia',
    'comentario',
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

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.traspasos && changes.traspasos.currentValue) {
      this.dataSource.data = changes.traspasos.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  doDelete(event: Event, row: Traspaso) {
    event.stopPropagation();
    this.delete.emit(row);
  }

  toggle(row: Traspaso) {
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
  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
