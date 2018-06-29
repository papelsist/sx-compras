import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material';

import { RequisicionDet } from '../../model';

@Component({
  selector: 'sx-requisicion-partidas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './requisicion-partidas.component.html',
  styleUrls: ['./requisicion-partidas.component.scss']
})
export class RequisicionPartidasComponent implements OnInit {
  @Input() partidas: RequisicionDet[] = [];
  @Input() parent: FormGroup;
  @Input() readOnly = false;
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();

  displayColumns = [
    'documentoSerie',
    'documentoFolio',
    'documentoFecha',
    'documentoTotal',
    'total',
    'comentario',
    'operaciones'
  ];

  @ViewChild('table') table: MatTable<any>;

  constructor() {}

  ngOnInit() {}

  refresh() {
    this.table.renderRows();
  }
}
