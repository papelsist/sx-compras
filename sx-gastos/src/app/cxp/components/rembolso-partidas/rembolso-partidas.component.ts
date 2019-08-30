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
import { MatTable, MatTableDataSource, MatSort } from '@angular/material';

import { RembolsoDet } from '../../model';

@Component({
  selector: 'sx-rembolso-partidas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rembolso-partidas.component.html',
  styleUrls: ['./rembolso-partidas.component.scss']
})
export class RembolsoPartidasComponent implements OnInit, OnChanges {
  @Input()
  partidas: RembolsoDet[] = [];
  @Input()
  parent: FormGroup;
  @Input()
  readOnly = false;
  @Output()
  update = new EventEmitter();
  @Output()
  edit = new EventEmitter();
  @Output()
  delete = new EventEmitter();
  @ViewChild(MatSort)
  sort: MatSort;

  dataSource = new MatTableDataSource<RembolsoDet>([]);

  displayColumns = [
    'nombre',
    'documentoSerie',
    'documentoFolio',
    'documentoFecha',
    'total',
    'apagar',
    'factura',
    'cuentaContable',
    'comentario',
    'operaciones'
  ];

  @ViewChild('table')
  table: MatTable<any>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      this.dataSource.data = changes.partidas.currentValue;
    }
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  refresh() {
    this.table.renderRows();
  }
}
