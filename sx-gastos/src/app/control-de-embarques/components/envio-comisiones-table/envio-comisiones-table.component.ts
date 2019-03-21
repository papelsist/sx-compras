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

import { EnvioComision } from '../../model';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sx-envio-comisiones-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './envio-comisiones-table.component.html',
  styleUrls: ['./envio-comisiones-table.component.scss']
})
export class EnvioComisionesTableComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input()
  comisiones: EnvioComision[] = [];
  @Input()
  filter;

  dataSource = new MatTableDataSource<EnvioComision>([]);

  displayColumns = [
    'select',
    'id',
    'sucursal',
    'nombre',
    'regreso',
    'valor',
    'comision',
    'kilos',
    'fechaComision',
    'comentarioDeComision',
    'entidad',
    'status',
    'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  print = new EventEmitter();

  @Output()
  select = new EventEmitter();

  @Output()
  edit = new EventEmitter();

  initialSelection = [];

  allowMultiSelect = true;

  @Input()
  currentSelection: EnvioComision[];

  subscription: Subscription;

  selection: SelectionModel<EnvioComision> = new SelectionModel<EnvioComision>(
    this.allowMultiSelect,
    this.initialSelection,
    true
  );

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.subscription = this.selection.changed.subscribe(() =>
      this.select.emit(this.selection.selected)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.comisiones && changes.comisiones.currentValue) {
      this.dataSource.data = changes.comisiones.currentValue;
    }
    if (changes.filter) {
      const f: string = changes.filter.currentValue || '';
      this.dataSource.filter = f.toLowerCase();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
