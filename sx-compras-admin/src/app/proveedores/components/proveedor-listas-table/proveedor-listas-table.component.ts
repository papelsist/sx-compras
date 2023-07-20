import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import { ListaDePreciosProveedor } from '../../models/listaDePreciosProveedor';

@Component({
  selector: 'sx-proveedor-listas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-listas-table.component.html',
  styleUrls: ['./proveedor-listas-table.component.scss']
})
export class ProveedorListasTableComponent implements OnInit, OnChanges {
  dataSource = new MatTableDataSource<ListaDePreciosProveedor>([]);
  @Input() listas: ListaDePreciosProveedor[];
  @Input()
  columnsToDisplay = [
    // 'proveedor',
    'id',
    'ejercicio',
    'mes',
    'moneda',
    'descripcion',
    'aplicada',
    'createUser',
    'updateUser',
    'modificada',
    'operaciones'
  ];
  @Input() search: string;
  @Output() select = new EventEmitter<ListaDePreciosProveedor[]>();
  @Output() delete = new EventEmitter<ListaDePreciosProveedor>();
  @Output() edit = new EventEmitter<ListaDePreciosProveedor>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.listas && changes.listas.currentValue) {
      this.dataSource.data = changes.listas.currentValue;
    }
    if (changes.search && changes.search.currentValue) {
      this.dataSource.filter = changes.search.currentValue;
    }
  }

  toogleSelect(event: ListaDePreciosProveedor) {
    event.selected = !event.selected;
    const data = this.listas.filter(item => item.selected);
    this.select.emit([...data]);
  }

  editLista(event: Event, prod: ListaDePreciosProveedor) {
    event.stopPropagation();
    this.edit.emit(prod);
  }

  deleteLista(event: Event, index: number, prod: ListaDePreciosProveedor) {
    event.stopPropagation();
    this.delete.emit(prod);
  }
  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
