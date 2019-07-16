import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  Inject,
  LOCALE_ID,
  ChangeDetectorRef
} from '@angular/core';
import { formatCurrency, formatNumber, formatDate } from '@angular/common';

import {
  GridOptions,
  GridApi,
  ColDef,
  GridReadyEvent,
  FilterChangedEvent,
  CellClickedEvent,
  RowDoubleClickedEvent
} from 'ag-grid-community';

@Component({
  selector: 'sx-lx-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'NO UI REQUIRED'
})
export class LxTableComponent<T> implements OnInit, OnChanges {
  @Input() partidas: T[] = [];

  gridOptions: GridOptions;
  gridApi: GridApi;
  defaultColDef;

  @Output() select = new EventEmitter();

  printFriendly = false;

  localeText: any;

  constructor(
    public cd: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.buildGridOptions();
    this.buildLocalText();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      if (this.gridApi) {
        this.gridApi.setRowData(changes.partidas.currentValue);
      }
    }
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.buildColsDef();
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      width: 150,
      sortable: true
    };
    this.gridOptions.onFilterChanged = this.onFilter.bind(this);
    this.gridOptions.onCellClicked = this.onCellClicked.bind(this);
    this.gridOptions.onRowDoubleClicked = this.onRowDoubleClicked.bind(this);
  }

  onModelUpdate(event) {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.partidas);
  }

  onFirstDataRendered(params) {}

  onFilter(event: FilterChangedEvent) {}

  onCellClicked(event: CellClickedEvent) {}

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.select.emit(event.data);
  }

  printGrid() {
    this.gridApi.setDomLayout('print');
    this.printFriendly = true;
    this.cd.detectChanges();
    setTimeout(() => {
      print();
      this.gridApi.setDomLayout(null);
      this.printFriendly = false;
      this.cd.detectChanges();
    }, 8000);
  }

  exportData() {
    const params = {
      fileName: `RQS_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  buildLocalText() {
    this.localeText = {
      page: 'página',
      more: 'mas',
      to: 'a',
      of: 'de',
      next: 'siguiente',
      last: 'ultimo',
      first: 'primero',
      previous: 'anterior',
      loadingOoo: 'cargando...',
      applyFilter: 'Aplicar...',
      equals: 'igual',
      notEqual: 'diferente a',
      lessThan: 'menor que',
      greaterThan: 'mayor que',
      lessThanOrEqual: 'menor o igual',
      greaterThanOrEqual: 'mayor o igual',
      inRange: 'rango',
      contains: 'contiene',
      notContains: 'no contiene',
      startsWith: 'inicia con',
      endsWith: 'termina con',
      filters: 'filtros'
    };
  }

  transformCurrency(data) {
    return formatCurrency(data, this.locale, '$');
  }

  transformNumber(data) {
    return formatNumber(data, this.locale, '');
  }

  transformDate(data) {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', this.locale);
    } else {
      return '';
    }
  }

  buildColsDef(): ColDef[] {
    return [];
  }
}
