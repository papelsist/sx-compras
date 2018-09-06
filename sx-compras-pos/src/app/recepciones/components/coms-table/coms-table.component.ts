import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { Subscription } from 'rxjs';

import { RecepcionDeCompra } from '../../models/recepcionDeCompra';

@Component({
  selector: 'sx-coms-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coms-table.component.html',
  styleUrls: ['./coms-table.component.scss']
})
export class ComsTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() coms: RecepcionDeCompra[] = [];
  @Input() multipleSelection = true;
  @Input() filter;
  dataSource = new MatTableDataSource<RecepcionDeCompra>([]);

  displayColumns = [
    'sucursalNombre',
    'documento',
    'compraFolio',
    'fecha',
    'nombre',
    'remision',
    'fechaRemision',
    'fechaInventario',
    'comentario',
    'total',
    // 'createUser',
    'modificado',
    'lastUpdatedBy',
    'operaciones'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() select = new EventEmitter();
  @Output() edit = new EventEmitter();
  subscription: Subscription;
  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.subscription = this.sort.sortChange.subscribe(e =>
      localStorage.setItem('sx-compras.coms-table.sort', JSON.stringify(e))
    );

    const sdata: string = localStorage.getItem('sx-compras.coms-table.sort');
    if (sdata) {
      const data: {
        active: string;
        direction: 'asc' | 'desc' | '';
      } = JSON.parse(sdata);
      this.sort.active = data.active;
      this.sort.direction = data.direction;
    } else {
      this.sort.active = 'documento';
      this.sort.direction = 'desc';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.coms && changes.coms.currentValue) {
      this.dataSource.data = changes.coms.currentValue;
    }
    if (changes.filter) {
      this.dataSource.filter = changes.filter.currentValue;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }

  getPrintUrl(event: RecepcionDeCompra) {
    return `coms/print/${event.id}`;
  }
}
