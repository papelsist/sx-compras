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

import { ChequeDevuelto } from '../../models';

@Component({
  selector: 'sx-cheques-devueltos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cheques-devueltos-table.component.html',
  styles: [
    `
      table {
        width: 100%;
        max-height: 500px;
        overflow: auto;
      }
      .mat-column-foloi {
        width: 70px;
      }
      .mat-column-fecha {
        width: 100px;
      }
      .mat-column-nombre {
        max-width: 270px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .mat-column-comentario {
        max-width: 200px;
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
export class ChequesDevueltosTableComponent implements OnInit, OnChanges {
  @Input()
  cheques: ChequeDevuelto[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<ChequeDevuelto>([]);

  displayColumns = [
    'numero',
    'fecha',
    'nombre',
    'importe',
    'comentario',
    'nc',
    'modificado',
    'usuario',
    'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

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
    if (changes.cheques && changes.cheques.currentValue) {
      this.dataSource.data = changes.cheques.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }
}
