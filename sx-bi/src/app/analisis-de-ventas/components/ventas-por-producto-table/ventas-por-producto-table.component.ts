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
import { VentaPorProducto } from 'app/analisis-de-ventas/models/venta-por-producto';

@Component({
  selector: 'sx-ventas-por-producto-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ventas-por-producto-table.component.html',
  styleUrls: ['./ventas-por-producto-table.component.scss']
})
export class VentasPorProductoTableComponent implements OnInit, OnChanges {
  @Input()
  ventas: VentaPorProducto[] = [];

  dataSource = new MatTableDataSource<VentaPorProducto>([]);

  /*
  */
  displayColumns = [
    'nacional',
    'linea',
    'clave',
    'descripcion',
    'ventaNeta',
    'kilos',
    'precio_kilos',
    'costo',
    'costo_kilos',
    'importeUtilidad',
    'porcentajeUtilidad',
    'clase',
    'marca',
    'kilosMillar',
    'gramos',
    'calibre',
    'caras',
    'deLinea'
  ];
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @Output()
  select = new EventEmitter();

  @Input()
  filter;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ventas && changes.ventas.currentValue) {
      this.dataSource.data = changes.ventas.currentValue;
    }
    if (changes.filter) {
      const s: string = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }
}
