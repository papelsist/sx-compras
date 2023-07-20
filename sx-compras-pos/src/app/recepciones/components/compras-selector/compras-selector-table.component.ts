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
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatTable
} from '@angular/material';

import { Compra } from 'app/ordenes/models/compra';

@Component({
  selector: 'sx-compras-selector-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compras-selector-table.component.html',
  styleUrls: ['./compras-selector-table.component.scss']
})
export class ComprasSelectorTableComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() compras: Compra[] = [];
  @Input() multipleSelection = false;
  @Input() filter;
  dataSource = new MatTableDataSource<Compra>([]);

  displayColumns = [
    // 'sucursalNombre',
    'folio',
    'fecha',
    'proveedor',
    'comentario',
    'pendiente'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() select = new EventEmitter();

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

  ngOnDestroy() {}

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

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
