import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'sx-productos-table',
  templateUrl: './productos-table.component.html',
  styleUrls: ['./productos-table.component.scss'],
})
export class ProductosTableComponent implements OnInit {
  @Input() dataSource;

  @Input()
  displayedColumns = [
    'clave',
    'descripcion',
    'kilos',
    'precioCredito',
    'precioContado',
    'linea',
    'marca',
    'clase',
  ];

  @Output() select = new EventEmitter();

  constructor() {}

  ngOnInit() {}


}
