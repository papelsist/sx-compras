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

import { Subscription } from 'rxjs';

import { Compra } from '../../models/compra';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'sx-compras-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compras-table.component.html',
  styleUrls: ['./compras-table.component.scss']
})
export class ComprasTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() compras: Compra[] = [];
  @Input() multipleSelection = true;
  @Input() filter;
  dataSource = new MatTableDataSource<Compra>([]);

  @Input() selected = [];

  @Input() initialSelection = [];

  selection = new SelectionModel<Compra>(
    this.multipleSelection,
    this.initialSelection
  );

  displayColumns = [
    // 'sucursalNombre',
    // 'select',
    'folio',
    'fecha',
    'proveedor',
    'comentario',
    'moneda',
    'tipoDeCambio',
    'total',
    'modificada',
    'lastUpdatedBy',
    'pendiente',
    'cerrada',
    'ultimaDepuracion',
    'operaciones'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() select = new EventEmitter();
  @Output() edit = new EventEmitter();
  subscription: Subscription;
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
      this.dataSource.filter = changes.filter.currentValue;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toogleSelect(event: Compra) {
    if (this.multipleSelection) {
      event.selected = !event.selected;
      const data = this.compras.filter(item => item.selected);
      this.select.emit([...data]);
    } else {
      event.selected = !event.selected;
      this.compras.forEach(item => {
        if (item.id !== event.id) {
          item.selected = false;
        }
      });
      this.select.emit([event]);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }

  getPrintUrl(event: Compra) {
    return `compras/print/${event.id}`;
  }

  isSelected(id: string) {
    return this.selected.find(item => item === id);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
