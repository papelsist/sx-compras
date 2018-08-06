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
import { FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource, MatPaginator } from '@angular/material';
import { NotaDeCreditoCxPDet, NotaDeCreditoCxP } from '../../model';

@Component({
  selector: 'sx-nota-conceptos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nota-conceptos.component.html',
  styleUrls: ['./nota-conceptos.component.scss']
})
export class NotaConceptosComponent implements OnInit, OnChanges {
  @Input() conceptos: NotaDeCreditoCxPDet[] = [];

  @Output() info = new EventEmitter();

  displayColumns = [
    'uuid',
    'serie',
    'folio',
    'fecha',
    'moneda',
    'tipoDeCambio',
    'total',
    'saldo',
    'operaciones'
  ];

  dataSource = new MatTableDataSource<NotaDeCreditoCxPDet>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.conceptos && changes.conceptos.currentValue) {
      this.dataSource.data = changes.conceptos.currentValue;
    }
  }
}
