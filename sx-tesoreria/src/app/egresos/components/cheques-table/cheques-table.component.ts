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

import { Cheque } from '../../models';

@Component({
  selector: 'sx-cheques-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cheques-table.component.html',
  styleUrls: ['./cheques-table.component.scss']
})
export class ChequesTableComponent implements OnInit, OnChanges {
  @Input()
  cheques: Cheque[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<Cheque>([]);

  displayColumns = [
    'folio',
    'nombre',
    'cuentaNumero',
    'banco',
    'fecha',
    'impreso',
    'importe',
    'liberado',
    'entregado',
    'comentario'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @Output()
  print = new EventEmitter();

  @Output()
  liberar = new EventEmitter();

  @Output()
  entregar = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cheques && changes.cheques.currentValue) {
      this.dataSource.data = changes.cheques.currentValue;
    }
    if (changes.filter && changes.filter.currentValue) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }
}
