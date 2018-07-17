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

import { ComprobanteFiscal } from '../../model/comprobanteFiscal';

@Component({
  selector: 'sx-cfdis-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cfdis-table.component.html',
  styleUrls: ['./cfdis-table.component.scss']
})
export class CfdisTableComponent implements OnInit, OnChanges {
  @Input() comprobantes: ComprobanteFiscal[] = [];
  dataSource = new MatTableDataSource<ComprobanteFiscal>([]);

  displayColumns = [
    'emisorNombre',
    'serie',
    'folio',
    'fecha',
    'moneda',
    'tipoDeCambio',
    'total',
    'metodoDePago',
    'formaDePago',
    'usoCfdi',
    'uuid',
    'tipoDeComprobante',
    'versionCfdi',
    'operaciones'
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() xml = new EventEmitter();
  @Output() pdf = new EventEmitter();
  @Output() select = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.comprobantes && changes.comprobantes.currentValue) {
      this.dataSource.data = changes.comprobantes.currentValue;
    }
  }

  toogleSelect(event: ComprobanteFiscal) {
    event.selected = !event.selected;
    const data = this.comprobantes.filter(item => item.selected);
    this.select.emit([...data]);
  }
}
