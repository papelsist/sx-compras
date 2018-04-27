import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'sx-productos-table',
  templateUrl: './productos-table.component.html',
  styleUrls: ['./productos-table.component.scss']
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
    'clase'
  ];

  constructor() {}

  ngOnInit() {}
}
