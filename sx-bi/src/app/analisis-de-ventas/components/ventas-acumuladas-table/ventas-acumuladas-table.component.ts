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

@Component({
  selector: 'sx-ventas-acumuladas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ventas-acumuladas-table.component.html',
  styleUrls: ['./ventas-acumuladas-table.component.scss']
})
export class VentasAcumuladasTableComponent implements OnInit, OnChanges {
  @Input()
  ventas: any[] = [];

  dataSource = new MatTableDataSource<any>([]);

  /*
  */
  displayColumns = [
    'descripcion',
    'ventaNeta',
    'kilos',
    'precio_kilos',
    'costo',
    'costo_kilos',
    'importeUtilidad',
    'porcentajeUtilidad',
    'inventarioCosteado',
    'kilosInv'
    // 'periodo',
    // 'origenId'
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
