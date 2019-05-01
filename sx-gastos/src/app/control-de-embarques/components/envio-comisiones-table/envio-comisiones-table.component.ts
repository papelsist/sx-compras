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

import * as _ from 'lodash';

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
    'manual',
    'sucursal',
    'nombre',
    'documentoTipo',
    'documentoFolio',
    'documentoFecha',
    'regreso',
    'valor',
    'valorCajas',
    'maniobra',
    'comision',
    'precioTonelada',
    'kilos',
    'importeComision',
    'fechaComision',
    // 'comentarioDeComision',
    'entidad',
    // 'status',
    'operaciones',
    'cliente'
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

  totalComision = 0.0;

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
      this.actuailizar();
    }
    if (changes.filter) {
      const f: string = changes.filter.currentValue || '';
      this.dataSource.filter = f.toLowerCase();
      this.actuailizar();
    }
  }

  actuailizar() {
    this.totalComision = _.sumBy(
      this.dataSource.filteredData,
      'importeComision'
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  clearSelection() {
    this.selection.clear();
  }
}
