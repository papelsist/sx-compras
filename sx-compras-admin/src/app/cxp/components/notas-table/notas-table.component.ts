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

import { NotaDeCreditoCxP } from '../../model';

@Component({
  selector: 'sx-notas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notas-table.component.html',
  styleUrls: ['./notas-table.component.scss']
})
export class NotasTableComponent implements OnInit, OnChanges {
  @Input() notas: NotaDeCreditoCxP[] = [];
  @Input() filter: string;
  dataSource = new MatTableDataSource<NotaDeCreditoCxP>([]);

  displayColumns = [
    'serie',
    'folio',
    'concepto',
    'nombre',
    'fecha',
    'moneda',
    'tipoDeCambio',
    'tcContable',
    'total',
    'disponible',
    'tipoDeRelacion',
    'comentario',
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
    if (changes.notas && changes.notas.currentValue) {
      this.dataSource.data = changes.notas.currentValue;
    }
    if (changes.filter) {
      this.dataSource.filter = changes.filter.currentValue.toLowerCase();
    }
  }

  toogleSelect(event: NotaDeCreditoCxP) {
    event.selected = !event.selected;
    const data = this.notas.filter(item => item.selected);
    this.select.emit([...data]);
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }

  getPrintUrl(event: NotaDeCreditoCxP) {
    return `cxp/notas/print/${event.id}`;
  }
}
