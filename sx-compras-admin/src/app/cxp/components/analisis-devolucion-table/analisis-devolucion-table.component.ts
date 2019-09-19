import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Inject,
  LOCALE_ID
} from '@angular/core';
import { formatCurrency, formatDate } from '@angular/common';

import {
  GridOptions,
  GridApi,
  ColDef,
  GridReadyEvent,
  FilterChangedEvent,
  CellClickedEvent,
  RowDoubleClickedEvent,
  RowSelectedEvent
} from 'ag-grid-community';
import { spAgGridText } from 'app/_shared/components/lx-table/table-support';

import { NotaDeCreditoCxP, AnalisisDeNota } from '../../model';

@Component({
  selector: 'sx-analisis-devolucion-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ag-grid-angular
      #agGrid
      class="ag-theme-balham"
      style="width: 100%; height: 100%;"
      [rowData]="partidas"
      [gridOptions]="gridOptions"
      [defaultColDef]="defaultColDef"
      [floatingFilter]="false"
      [localeText]="localeText"
      [stopEditingWhenGridLosesFocus]="true"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
      (modelUpdated)="onModelUpdate($event)"
      [enterMovesDown]="true"
      [enterMovesDownAfterEdit]="true"
      rowSelection="multiple"
      [rowMultiSelectWithClick]="true"

    >
    </ag-grid-angular>
  `
})
export class AnalisisDevolucionTableComponent implements OnInit, OnChanges {
  @Input() partidas: AnalisisDeNota[] = [];

  gridOptions: GridOptions;
  gridApi: GridApi;
  defaultColDef;

  @Output() select = new EventEmitter();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() update = new EventEmitter<AnalisisDeNota>();

  localeText: any;

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.buildGridOptions();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
    }
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
    this.gridOptions.onRowDoubleClicked = (event: RowDoubleClickedEvent) => {
      this.select.emit(event.data);
    };
    this.gridOptions.onRowSelected = (event: RowSelectedEvent) => {
      this.selectionChange.emit(this.gridApi.getSelectedRows());
    };
    this.localeText = spAgGridText;
    this.gridOptions.getRowStyle = this.getRowStyles.bind(this);
    this.gridOptions.onCellEditingStopped = params => {
      // console.log('Edition stopped: ', params);
      // const row: AnalisisDeNota = params.data;
      this.update.emit(params.data);
    };
  }

  getRowStyles(params: any) {
    if (params.data.analizado <= 0) {
      return {
        color: 'rgb(231, 61, 61)'
      };
    } else {
      return '';
    }
  }

  onModelUpdate(event) {
    if (this.gridApi) {
      this.actualizarTotales();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onFirstDataRendered(params) {}

  onFilter(event: FilterChangedEvent) {}

  exportData() {
    const params = {
      fileName: `ANALISIS_NOTQ_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  actualizarTotales() {
    let registros = 0;
    this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
      const a: AnalisisDeNota = rowNode.data;
      registros++;
    });
    const res = [
      {
        sucursal: `Reg: ${registros}`
      }
    ];
    this.gridApi.setPinnedBottomRowData(res);
  }

  private buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        width: 110,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'DEC',
        field: 'decFolio',
        width: 100,
        pinned: 'left'
      },
      {
        headerName: 'DEC F.',
        field: 'decFecha',
        width: 110,
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Producto',
        field: 'clave',
        width: 110
      },
      {
        headerName: 'Descripción',
        field: 'clave',
        width: 250
      },
      {
        headerName: 'cantidad',
        field: 'cantidad',
        width: 95
      },
      {
        headerName: 'U',
        field: 'unidad',
        width: 80
      },
      {
        headerName: 'costo',
        field: 'costo',
        width: 110,
        editable: true,
        valueFormatter: params => {
          if (params.node.isRowPinned()) {
            return '';
          } else {
            return this.transformCurrency(params.value);
          }
        }
      },
      {
        headerName: 'importe',
        field: 'importe',
        width: 110,
        valueFormatter: params => {
          if (params.node.isRowPinned()) {
            return '';
          } else {
            return this.transformCurrency(params.value);
          }
        }
      },
      {
        headerName: 'Referencia',
        field: 'referencia',
        width: 110
      }
    ];
  }

  transformCurrency(data) {
    return formatCurrency(data, this.locale, '$');
  }

  transformDate(data, format: string = 'dd/MM/yyyy') {
    if (data) {
      return formatDate(data, format, this.locale);
    } else {
      return '';
    }
  }
}
