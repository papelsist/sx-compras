import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  GridApi,
  GridReadyEvent,
  RowDoubleClickedEvent,
  ColDef,
  GridOptions
} from 'ag-grid-community';

import * as _ from 'lodash';

import { Rembolso } from '../../model';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { spAgGridText } from 'app/_shared/components/lx-table/table-support';

@Component({
  selector: 'sx-rembolsos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <ag-grid-angular
    #agGrid
    class="ag-theme-balham"
    style="width: 100%; height: 100%;"
    [rowData]="rembolsos"
    [columnDefs]="columns"
    [defaultColDef]="defaultColDef"
    [gridOptions]="gridOptions"
    [localeText]="localeText"
    [floatingFilter]="floatingFilters"
    (gridReady)="onGridReady($event)"
    (rowDoubleClicked)="onRowDoubleClicked($event)">
  </ag-grid-angular>
  `
})
export class RembolsosTableComponent implements OnInit {
  gridApi: GridApi;
  gridOptions: GridOptions;
  localeText: any;
  columns: ColDef[] = [];
  defaultColDef: ColDef;
  floatingFilters = true;
  rowStyle: any;

  @Input()
  rembolsos: Rembolso[] = [];

  @Output()
  select = new EventEmitter();

  constructor(public tableService: SxTableService) {
    this.buildGrid();
  }

  ngOnInit() {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  buildGrid() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.getRowStyle = this.buildRowStyle.bind(this);
    this.gridOptions.onModelUpdated = this.onModelUpdate.bind(this);
    this.localeText = spAgGridText;
    this.columns = this.buildColsDef();
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true
    };
    this.gridOptions.onGridReady = params => {
      this.gridApi.sizeColumnsToFit();
      this.actualizarTotales();
    };
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    if (!event.node.isRowPinned()) {
      this.select.emit(event.data);
    }
  }

  onModelUpdate(event) {
    if (this.gridApi) {
      this.actualizarTotales();
    }
  }
  actualizarTotales() {
    let registros = 0;
    let total = 0;
    this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
      const requisicion: Partial<Rembolso> = rowNode.data;
      registros++;
      total += requisicion.total;
    });
    const res = [
      {
        id: 'Registros:',
        concepto: `${registros}`,
        total
      }
    ];
    this.gridApi.setPinnedBottomRowData(res);
  }

  exportData(prefix: string = 'REMBOLSOS') {
    const params = {
      fileName: `${prefix}_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  buildRowStyle(params: any) {
    if (params.data.egreso === null) {
      return {
        color: 'rgb(231, 61, 61)'
      };
    } else if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    } else {
      return '';
    }
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Folio',
        field: 'id',
        width: 90,
        pinned: 'left'
      },
      {
        headerName: 'Concepto',
        field: 'concepto',
        width: 110,
        pinned: 'left'
      },
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        width: 110,
        pinned: 'left',
        valueGetter: params => {
          if (params.node.isRowPinned()) {
            return '';
          }
          return params.data.sucursal.nombre;
        }
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        width: 300,
        pinned: 'left'
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        // filter: 'agDateColumnFilter',
        width: 110,
        valueFormatter: params => this.tableService.formatDate(params.value)
      },
      {
        headerName: 'Fecha P',
        field: 'fechaDePago',
        width: 100,
        valueFormatter: params => this.tableService.formatDate(params.value)
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 130,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 110,
        valueGetter: params => {
          if (params.node.isRowPinned()) {
            return '';
          }
          return params.data.egreso ? 'PAGADA' : 'PENDIENTE';
        }
      },
      {
        headerName: 'Comentario',
        field: 'comentario'
      }
    ];
  }
}
