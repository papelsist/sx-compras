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

import { Pago } from '../../model';

@Component({
  selector: 'sx-pagos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagos-table.component.html',
  styleUrls: ['./pagos-table.component.scss']
})
export class PagosTableComponent implements OnInit, OnChanges {
  @Input() pagos: Pago[] = [];
  @Input() filter: string;
  dataSource = new MatTableDataSource<Pago>([]);

  displayColumns = [
    'folio',
    'nombre',
    'requisicion',
    'fecha',
    'moneda',
    'tipoDeCambio',
    'total',
    'aplicado',
    'disponible',
    'modificado',
    'operaciones'
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() print = new EventEmitter();
  @Output() select = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() pdf = new EventEmitter();
  @Output() xml = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pagos && changes.pagos.currentValue) {
      this.dataSource.data = changes.pagos.currentValue;
    }
    if (changes.filter && changes.filter.currentValue) {
      this.dataSource.filter = changes.filter.currentValue.toLowerCase();
    }
  }

  toogleSelect(event: Pago) {
    event.selected = !event.selected;
    const data = this.pagos.filter(item => item.selected);
    this.select.emit([...data]);
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }
}
