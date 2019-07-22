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

import { Contrarecibo } from '../../model';

@Component({
  selector: 'sx-recibos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recibos-table.component.html',
  styleUrls: ['./recibos-table.component.scss']
})
export class RecibosTableComponent implements OnInit, OnChanges {
  @Input()
  recibos: Contrarecibo[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<Contrarecibo>([]);

  @Input()
  displayColumns = [
    'folio',
    'nombre',
    'fecha',
    'moneda',
    'total',
    'comentario',
    'modificado',
    'atendido',
    'operaciones'
  ];
  @ViewChild(MatSort)
  sort: MatSort;

  @Output()
  select = new EventEmitter();
  // @Output() edit = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.recibos && changes.recibos.currentValue) {
      this.dataSource.data = changes.recibos.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  toogleSelect(event: Contrarecibo) {
    event.selected = !event.selected;
    const data = this.recibos.filter(item => item.selected);
    this.select.emit([...data]);
  }
  /*
  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }
  */
}
