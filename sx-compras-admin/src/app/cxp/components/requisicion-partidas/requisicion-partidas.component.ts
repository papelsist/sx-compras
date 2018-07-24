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

import { RequisicionDet } from '../../model';

@Component({
  selector: 'sx-requisicion-partidas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './requisicion-partidas.component.html',
  styleUrls: ['./requisicion-partidas.component.scss']
})
export class RequisicionPartidasComponent implements OnInit, OnChanges {
  @Input() partidas: RequisicionDet[] = [];
  @Input() parent: FormGroup;
  @Input() readOnly = false;
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<RequisicionDet>([]);

  displayColumns = [
    'documentoSerie',
    'documentoFolio',
    'documentoFecha',
    'documentoTotal',
    'total',
    'descuentof',
    'apagar',
    'comentario',
    'operaciones'
  ];

  @ViewChild('table') table: MatTable<any>;

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
