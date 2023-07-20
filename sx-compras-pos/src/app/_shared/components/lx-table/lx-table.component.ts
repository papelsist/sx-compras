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

import {
  GridOptions,
  GridApi,
  ColDef,
  GridReadyEvent,
  FilterChangedEvent,
  CellClickedEvent,
  RowDoubleClickedEvent
} from 'ag-grid-community';
import { SxTableService } from './sx-table.service';
import { spAgGridText } from './table-support';

@Component({
  selector: 'sx-lx-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'NO UI REQUIRED'
})
export class LxTableComponent implements OnInit, OnChanges {
  @Input() partidas: any[] = [];
  @Output() select = new EventEmitter();

  public exportKey = 'EX';
  public debug = false;

  public gridOptions: GridOptions;
  public gridApi: GridApi;
  public defaultColDef: ColDef;

  public printFriendly = false;

  public localeText: any;

  constructor(public tableService: SxTableService) {
    this.buildGridOptions();
    this.buildLocalText();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      if (this.gridApi) {
        this.setRowData(changes.partidas.currentValue);
      }
    }
  }

  setRowData(data: any[]) {
    if (this.debug) {
      console.log('Partidas', data);
    }
    this.gridApi.setRowData(data);
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.buildColsDef();
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      width: 150,
      sortable: true,
      resizable: true
    };
    this.gridOptions.onFilterChanged = this.onFilter.bind(this);
    this.gridOptions.onCellClicked = this.onCellClicked.bind(this);
    this.gridOptions.onRowDoubleClicked = this.onRowDoubleClicked.bind(this);
    this.gridOptions.getRowStyle = this.buildRowStyle.bind(this);
  }

  onModelUpdate(event) {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.partidas);
  }

  buildRowStyle(params: any) {
    /*
    if (params.data.pagada) {
      return {
        color: 'rgb(231, 61, 61)'
      };
    } else {
      return '';
    }
    */
    return {};
  }

  onFirstDataRendered(params) {}

  onFilter(event: FilterChangedEvent) {}

  onCellClicked(event: CellClickedEvent) {}

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.select.emit(event.data);
  }

  exportData(prefix: string = this.exportKey) {
    const params = {
      fileName: `${prefix}_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  buildLocalText() {
    this.localeText = spAgGridText;
  }

  transformCurrency(data) {
    return this.tableService.formatCurrency(data);
  }

  transformNumber(data, info = null) {
    return this.tableService.formatNumber(data, info);
  }

  transformDate(data, format: string = 'dd/MM/yyyy') {
    const fecha = this.changeDate(data);
    return this.tableService.formatDate(fecha, format);
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }

  buildColsDef(): ColDef[] {
    return [];
  }
}
