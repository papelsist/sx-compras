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
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Subject } from 'rxjs';
import { takeUntil, debounceTime, tap } from 'rxjs/operators';

import { EnvioComision } from '../../model';

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

  loading = false;

  displayColumns = [
    'select',
    'id',
    'manual',
    'nombre',
    'sucursal',
    'documentoTipo',
    'regreso',
    'documentoFolio',
    'documentoFecha',
    'valor',
    'valorCajas',
    'maniobra',
    'comision',
    'precioTonelada',
    'kilos',
    'importeComision',
    'total',
    'fechaComision',
    'cliente'
  ];

  @ViewChild(MatSort)
  sort: MatSort;

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

  destroy$ = new Subject<boolean>();

  totalComision = 0.0;

  selection: SelectionModel<EnvioComision> = new SelectionModel<EnvioComision>(
    this.allowMultiSelect,
    this.initialSelection,
    true
  );

  filteredData: EnvioComision[] = [];

  filterForm: FormGroup;

  props = ['nombre', 'sucursal', 'documentoTipo', 'documentoFolio', 'regreso'];

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.buildForm();
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.selection.changed
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.select.emit(this.selection.selected));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.comisiones && changes.comisiones.currentValue) {
      this.filterData();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.filterForm = this.fb.group({
      sucursal: [],
      nombre: [],
      documentoTipo: [],
      documentoFolio: [],
      regreso: []
    });
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500)
      )
      .subscribe(val => {
        this.filterData();
      });
  }

  private filterData() {
    const val = this.filterForm.value;
    let data = this.comisiones;

    this.props.forEach(item => {
      if (val[item]) {
        data = this.filterBy(data, item, val[item]);
      }
    });
    this.dataSource.data = data;
    this.dataSource.filteredData = data;
    this.cd.markForCheck();
  }

  filterBy(data: EnvioComision[], property: string, term: string) {
    return data.filter(item => {
      const f: string = term || '';
      return item[property].toLowerCase().includes(f.toLocaleLowerCase());
    });
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

  clearSelection() {
    this.selection.clear();
  }

  totalByProperty(property: string) {
    return _.round(_.sumBy(this.dataSource.data, property), 2);
  }
}
