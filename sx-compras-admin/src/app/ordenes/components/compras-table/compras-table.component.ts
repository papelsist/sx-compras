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

import { Compra } from '../../models/compra';

@Component({
  selector: 'sx-compras-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compras-table.component.html',
  styleUrls: ['./compras-table.component.scss']
})
export class ComprasTableComponent implements OnInit, OnChanges {
  @Input() compras: Compra[] = [];
  @Input() multipleSelection = true;
  @Input() filter;
  dataSource = new MatTableDataSource<Compra>([]);

  displayColumns = [
    'sucursalNombre',
    'folio',
    'fecha',
    'proveedor',
    'comentario',
    'moneda',
    'tipoDeCambio',
    'total',
    'createUser',
    'updateUser',
    'modificada',
    'pendiente',
    'operaciones'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() select = new EventEmitter();
  @Output() edit = new EventEmitter();

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
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
