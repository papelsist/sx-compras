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

import { AnalisisDeTransformacion } from '../../model';

@Component({
  selector: 'sx-analisis-trs-table',
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
export class AnalisisTrsTableComponent implements OnInit, OnChanges {
  @Input() partidas: AnalisisDeTransformacion[] = [];

  gridOptions: GridOptions;
  gridApi: GridApi;
  defaultColDef;

  @Output() select = new EventEmitter();
  @Output() selectionChange = new EventEmitter<any[]>();

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
    this.gridOptions.getRowStyle = this.buildRowStyle.bind(this);
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
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
    let total = 0;
    let analizado = 0;
    this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
      const a: AnalisisDeTransformacion = rowNode.data;
      registros++;
      total += a.total;
      analizado += a.analizado;
    });
    const res = [
      {
        sucursal: `Reg: ${registros}`,
        total,
        analizado
      }
    ];
    this.gridApi.setPinnedBottomRowData(res);
  }

  private buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Proveedor',
        field: 'nombre',
        width: 250,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 110,
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Factura',
        field: 'factura',
        width: 110
      },
      {
        headerName: 'UUID',
        field: 'uuid',
        width: 100,
        cellRenderer: params => {
          if (params.value) {
            return params.value.substring(0, 5);
          }
        }
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Analizado',
        field: 'analizado',
        width: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        width: 250
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
