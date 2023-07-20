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
import { MatTableDataSource, MatSort } from '@angular/material';

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

  
  @Input()
  filter: string;
  
  @ViewChild(MatSort) sort: MatSort;
  
  @Output() xml = new EventEmitter();
  @Output() pdf = new EventEmitter();
  @Output() select = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.comprobantes && changes.comprobantes.currentValue) {
      this.dataSource.data = changes.comprobantes.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  onSelect(event: ComprobanteFiscal) {
    this.select.emit(event);
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }

}
