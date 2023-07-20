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
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AplicacionDePago } from '../../model';

import * as _ from 'lodash';

@Component({
  selector: 'sx-aplicaciones-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './aplicaciones-table.component.html',
  styleUrls: ['./aplicaciones-table.component.scss']
})
export class AplicacionesComponent implements OnInit, OnChanges {
  @Input() aplicaciones: AplicacionDePago[] = [];

  @Output() delete = new EventEmitter();
  @Input() filtro;

  displayColumns = [
    'serie',
    'folio',
    'fechaDocto',
    'uuid',
    'moneda',
    'fecha',
    'documentoTotal',
    'importe',
    'comentario',
    'operaciones'
  ];

  dataSource = new MatTableDataSource<AplicacionDePago>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.aplicaciones && changes.aplicaciones.currentValue) {
      this.dataSource.data = changes.aplicaciones.currentValue;
    }
    if (changes.filtro && changes.filtro.currentValue) {
      this.dataSource.filter = changes.filtro.currentValue;
    }
  }

  getTotal(property: string) {
    return _.sumBy(this.dataSource.filteredData, property);
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
