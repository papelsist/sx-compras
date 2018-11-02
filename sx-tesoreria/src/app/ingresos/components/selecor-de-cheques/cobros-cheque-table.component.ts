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

import { CobroCheque } from '../../models';

@Component({
  selector: 'sx-cobros-cheque-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cobros-cheque-table.component.html',
  styles: [
    `
      table {
        width: 100%;
        max-height: 750px;
        overflow-x: auto;
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
export class CobrosChequeTableComponent implements OnInit, OnChanges {
  @Input()
  cheques: CobroCheque[] = [];
  @Input()
  multipleSelection = false;
  dataSource = new MatTableDataSource<CobroCheque>([]);

  displayColumns = [
    'numero',
    'fecha',
    'primeraAplicacion',
    'importe',
    'nombre',
    'ficha'
  ];
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @Output()
  select = new EventEmitter();

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
      const s: string = changes.filter.currentValue || '';
      this.dataSource.filter = s.toUpperCase();
    }
  }

  toogleSelect(event: CobroCheque) {
    if (this.multipleSelection) {
      event.selected = !event.selected;
      const data = this.cheques.filter(item => item.selected);
      this.select.emit([...data]);
    } else {
      event.selected = !event.selected;
      this.cheques.forEach(item => {
        if (item.id !== event.id) {
          item.selected = false;
        }
      });
      this.select.emit([event]);
    }
  }
}
