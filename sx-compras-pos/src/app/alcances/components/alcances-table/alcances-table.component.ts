import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import * as _ from 'lodash';

import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sx-alcances-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alcances-table.component.html',
  styleUrls: ['./alcances-table.component.scss']
})
export class AlcancesTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() rows: any[] = [];
  @Input() filter: string;
  dataSource = new MatTableDataSource<any>([]);

  displayColumns = [
    'clave',
    'descripcion',
    'existencia',
    'promVta',
    'alcance',
    'comprasPendientes',
    'alcanceMesPedido',
    'porPedir',
    'nombre',
    'linea',
    'marca',
    'clase'
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() print = new EventEmitter();
  @Output() select = new EventEmitter<any[]>();
  @Output() edit = new EventEmitter<any>();

  @Input() allowMultiSelection = true;
  @Input() selection = new SelectionModel<any>(this.allowMultiSelection, []);
  subscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.subscription = this.selection.onChange.subscribe(res =>
      this.select.next(this.selection.selected)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.rows && changes.rows.currentValue) {
      this.dataSource.data = changes.rows.currentValue;
    }
    if (changes.filter) {
      const text = changes.filter.currentValue
        ? changes.filter.currentValue
        : '';
      this.dataSource.filter = text.toLowerCase();
      this.selection.clear();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }

  getTotal(property: string) {
    return _.sumBy(this.dataSource.filteredData, property);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }
}
