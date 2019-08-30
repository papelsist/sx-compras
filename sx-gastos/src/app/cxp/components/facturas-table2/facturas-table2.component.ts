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

import {
  GridApi,
  GridReadyEvent,
  RowDoubleClickedEvent,
  ColDef,
  GridOptions
} from 'ag-grid-community';

import * as _ from 'lodash';

import { CuentaPorPagar } from '../../model';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { spAgGridText } from 'app/_shared/components/lx-table/table-support';

@Component({
  selector: 'sx-facturas-table2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ag-grid-angular
      #agGrid
      class="ag-theme-balham"
      style="width: 100%; height: 100%;"
      [rowData]="facturas"
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
export class FacturasTable2Component implements OnInit {
  gridApi: GridApi;
  gridOptions: GridOptions;
  localeText: any;
  columns: ColDef[] = [];
  defaultColDef: ColDef;
  floatingFilters = true;
  rowStyle: any;
  @Input()
  facturas: CuentaPorPagar[] = [];

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
    this.localeText = spAgGridText;
    this.columns = this.buildColsDef();
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true
    };
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    if (!event.node.isRowPinned()) {
      this.select.emit(event.data);
    }
  }

  exportData(prefix: string = 'FACTURAS_GASTOS') {
    const params = {
      fileName: `${prefix}_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  buildRowStyle(params: any) {
    if (!params.data.gastoAnalizadoFecha) {
      return {
        color: 'rgb(231, 61, 61)'
      };
    } else {
      return '';
    }
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Nombre',
        field: 'nombre',
        width: 300,
        pinned: 'left'
      },
      {
        headerName: 'Serie',
        field: 'serie',
        width: 80,
        pinned: 'left'
      },
      {
        headerName: 'Folio',
        field: 'folio',
        width: 90,
        pinned: 'left'
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 100,
        valueFormatter: params => this.tableService.formatDate(params.value)
      },
      {
        headerName: 'Tipo',
        field: 'tipo',
        width: 90
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        width: 80
      },
      {
        headerName: 'Sub Tot',
        field: 'subTotal',
        width: 110,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      },
      {
        headerName: 'Imp Tras',
        field: 'impuestoTrasladado',
        width: 110,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      },
      {
        headerName: 'Imp Ret',
        field: 'impuestoRetenido',
        width: 110,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 110,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      },
      {
        headerName: 'Pagos',
        field: 'pagos',
        width: 110,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      },
      {
        headerName: 'Saldo',
        field: 'saldo',
        width: 110,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      },
      {
        headerName: 'UUID',
        field: 'uuid',
        width: 80,
        valueGetter: params => params.data.uuid.substr(-12, 12)
      },
      {
        headerName: 'Analizado',
        field: 'gastoAnalizadoFecha',
        width: 90,
        valueFormatter: params => this.tableService.formatDate(params.value)
      }
    ];
  }
}
