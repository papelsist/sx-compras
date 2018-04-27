import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MatTable } from '@angular/material';

@Component({
  selector: 'sx-orden-form-table',
  templateUrl: './orden-form-partidas.component.html',
  styleUrls: [`./orden-form-partidas.component.scss`]
})
export class OrdenFormTableComponent implements OnInit {
  displayedColumns = [
    'clave',
    'descripcion',
    'solicitado',
    'comentario',
    'precio',
    'actions'
  ];
  @Input() partidas: any[];
  @ViewChild('table') table: MatTable<any>;

  constructor() {}

  ngOnInit() {}

  selectRow(index) {
    console.log('Row: ', index);
  }

  reload() {
    this.table.renderRows();
  }
}
