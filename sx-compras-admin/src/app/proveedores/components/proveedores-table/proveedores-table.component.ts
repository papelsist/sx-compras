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

import { Proveedor } from '../../models/proveedor';

@Component({
  selector: 'sx-proveedores-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedores-table.component.html',
  styleUrls: ['./proveedores-table.component.scss']
})
export class ProveedoresTableComponent implements OnInit, OnChanges {
  dataSource = new MatTableDataSource<Proveedor>([]);
  @Input() proveedores: Proveedor[];
  @Input() columnsToDisplay = ['clave', 'nombre', 'tipo', 'estado', 'rfc'];
  @Output() select = new EventEmitter<Proveedor>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.proveedores && changes.proveedores.currentValue) {
      this.dataSource.data = changes.proveedores.currentValue;
    }
  }
}
