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
  @Input()
  compras: Compra[] = [];
  @Input()
  multipleSelection = true;
  @Input()
  filter;
  dataSource = new MatTableDataSource<Compra>([]);

  @Input()
  selected = [];

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

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @Output()
  select = new EventEmitter();
  @Output()
  edit = new EventEmitter();
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
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toogleSelect(event: Compra) {
    /*
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
    */
    if (this.isSelected(event.id)) {
      const res = this.selected.filter(item => item.id !== event.id);
      this.select.emit(res);
    } else {
      const res = [...this.selected, event];
      this.select.emit(res);
    }
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }

  getPrintUrl(event: Compra) {
    return `compras/print/${event.id}`;
  }

  isSelected(id: string) {
    return this.selected.find(item => item.id === id);
  }
}
