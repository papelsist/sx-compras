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
  selector: 'sx-operaciones-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './operaciones-table.component.html',
  styleUrls: ['./operaciones-table.component.scss']
})
export class OperacionesTableComponent implements OnInit, OnChanges {
  @Input()
  ventas: any[] = [];

  dataSource = new MatTableDataSource<any>([]);

  displayColumns = [
    'tipo',
    'cliente',
    'documento',
    'fecha',
    'origen',
    'kilos',
    'precio_kilos',
    'suc',
    'ventaNeta',
    'costo',
    'costo_kilos',
    'importeUtilidad',
    'porcentajeUtilidad'
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
