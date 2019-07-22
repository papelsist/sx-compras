import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { CompraDet } from '../../models/compraDet';

@Component({
  selector: 'sx-compradet-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compradet-table.component.html',
  styleUrls: ['./compradet-table.component.scss']
})
export class CompradetTableComponent implements OnInit, OnChanges {
  @Input() partidas: CompraDet[] = [];
  @Input() filter;

  displayColumns = [
    'folio',
    'clave',
    'descripcion',
    'solicitado',
    // 'precio',
    // 'descuento1',
    // 'descuento2',
    // 'descuento3',
    // 'descuento4',
    // 'importeNeto',
    'recibido',
    'depurado',
    'porRecibir'
  ];

  dataSource = new MatTableDataSource<CompraDet>([]);

  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      this.dataSource.data = changes.partidas.currentValue;
    }
    if (changes.filter) {
      if (!changes.filter) {
        this.dataSource.filter = '';
      } else {
        this.dataSource.filter = changes.filter.currentValue;
      }
    }
  }
}
