import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { CuentaPorPagar } from '../../model';

@Component({
  selector: 'sx-recibo-partidas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recibo-partidas.component.html',
  styleUrls: ['./recibo-partidas.component.scss']
})
export class ReciboPartidasComponent implements OnInit, OnChanges {
  @Input()
  partidas: CuentaPorPagar[] = [];
  @Input()
  filter: string;
  @Input()
  parent: FormGroup;
  @Input()
  readOnly = false;
  @Output()
  delete = new EventEmitter();
  @Output()
  xml = new EventEmitter();
  @Output()
  pdf = new EventEmitter();

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  dataSource = new MatTableDataSource<CuentaPorPagar>([]);

  @Input()
  displayColumns = [
    'nombre',
    'serie',
    'folio',
    'fecha',
    'moneda',
    // 'tipoDeCambio',
    'total',
    // 'metodoDePago',
    // 'formaDePago',
    // 'usoCfdi',
    'tipoDeComprobante',
    // 'versionCfdi',
    'uuid',
    'operaciones'
  ];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      this.dataSource.data = changes.partidas.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
