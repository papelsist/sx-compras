import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatTableDataSource } from '@angular/material';

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
  @Input() columnsToDisplay = ['nombre', 'tipo', 'rfc'];
  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.proveedores && changes.proveedores.currentValue) {
      this.dataSource.data = changes.proveedores.currentValue;
    }
  }
}
