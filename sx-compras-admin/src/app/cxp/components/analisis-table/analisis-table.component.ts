import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import { Analisis } from '../../model/analisis';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'sx-analisis-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analisis-table.component.html',
  styleUrls: ['./analisis-table.component.scss']
})
export class AnalisisTableComponent implements OnInit {
  @Input() analisis: Analisis[] = [];
  dataSource = new MatTableDataSource<Analisis>([]);
  displayColumns = ['proveedor']; // , 'serie', 'folio', 'total'];

  constructor() {}

  ngOnInit() {}
}
