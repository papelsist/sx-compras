import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'sx-ordenes-table',
  templateUrl: './ordenes-table.component.html',
  styleUrls: ['./ordenes-table.component.scss']
})
export class OrdenesTableComponent implements OnInit {
  @Input() dataSource = new MatTableDataSource([]);
  @Output() select = new EventEmitter();
  displayedColumns = ['folio', 'fecha', 'proveedor', 'comentario'];

  constructor() {}

  ngOnInit() {}

  onSelect(row) {
    this.select.emit(row);
  }
}
