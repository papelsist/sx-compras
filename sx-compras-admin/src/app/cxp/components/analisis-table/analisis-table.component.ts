import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { Analisis } from '../../model/analisis';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'sx-analisis-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analisis-table.component.html',
  styleUrls: ['./analisis-table.component.scss']
})
export class AnalisisTableComponent implements OnInit, OnChanges {
  @Input() analisis: Analisis[] = [];
  @Output() edit = new EventEmitter();
  @Output() select = new EventEmitter();
  dataSource = new MatTableDataSource<Analisis>([]);
  displayColumns = [
    'proveedor',
    'factura',
    'importe',
    'uuid',
    'cerrado',
    'operaciones'
  ]; // , 'serie', 'folio', 'total'];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.analisis && changes.analisis.currentValue) {
      this.dataSource.data = changes.analisis.currentValue;
    }
  }

  toogleSelect(event: Analisis) {
    event.selected = !event.selected;
    const data = this.analisis.filter(item => item.selected);
    this.select.emit([...data]);
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }
}
