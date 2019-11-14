import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

import * as _ from 'lodash';

import {
  RowSelectedEvent,
  ModelUpdatedEvent,
  ColDef,
  GridReadyEvent,
  ColumnApi,
  FilterModifiedEvent,
  CellDoubleClickedEvent
} from 'ag-grid-community';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';

@Component({
  selector: 'sx-alcances-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="height: 100%">
      <ag-grid-angular
        #agGrid
        class="ag-theme-balham"
        style="width: 100%; height: 100%;"
        [gridOptions]="gridOptions"
        [defaultColDef]="defaultColDef"
        [floatingFilter]="true"
        [animateRows]="true"
        [localeText]="localeText"
        (firstDataRendered)="onFirstDataRendered($event)"
        (gridReady)="onGridReady($event)"
        [stopEditingWhenGridLosesFocus]="true"
        (modelUpdated)="onModelUpdate($event)"
        (filterModified)="onFilterUpdate($event)"
        [frameworkComponents]="frameworkComponents"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [``]
})
export class AlcancesTableComponent extends LxTableComponent
  implements OnInit, OnChanges {
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() pendientes = new EventEmitter();
  columnApi: ColumnApi;

  frameworkComponents = {};

  constructor(public tableService: SxTableService) {
    super(tableService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      if (this.gridApi) {
        this.setRowData(changes.partidas.currentValue);
      }
    }
  }
  ngOnInit() {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.setRowData(this.partidas);
  }

  setRowData(data: any[]) {
    this.gridApi.setRowData(data);
  }

  buildGridOptions() {
    super.buildGridOptions();
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.rowMultiSelectWithClick = true;
    this.gridOptions.onRowSelected = (event: RowSelectedEvent) => {
      this.selectionChange.emit(this.gridApi.getSelectedRows());
    };
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      width: 150,
      sortable: true,
      resizable: true,
      pinnedRowCellRenderer: r => ''
    };
    this.gridOptions.onCellDoubleClicked = (event: CellDoubleClickedEvent) => {
      if (event.column.getColId() === 'comprasPendientes') {
        this.pendientes.emit(event.data);
      }
    };
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }
  onModelUpdate(event: ModelUpdatedEvent) {
    this.actualizarTotales();
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }
  onFilterUpdate(event: FilterModifiedEvent) {
    // console.log('Filter: ', event);
    const model = this.gridApi.getFilterModel();
    // console.log('Filter model: ', this.gridApi.getFilterModel());
    localStorage.setItem('alcances.table.filter', JSON.stringify(model));
  }

  getAllRows() {
    const data = [];
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const det = rowNode.data;
        data.push(det);
      });
    }
    return data;
  }

  actualizarTotales() {
    let registros = 0;
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const alcance = rowNode.data;
        registros++;
      });
    }
    const res = [
      {
        descripcion: `Registros: ${registros}`
      }
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Producto',
        field: 'clave',
        width: 135,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        pinned: 'left',
        resizable: true,
        width: 320,
        pinnedRowCellRenderer: r => r.value
      },
      {
        headerName: 'Exis',
        field: 'existencia',
        width: 120,
        valueFormatter: params => this.transformNumber(params.value, '1.3-3')
      },
      {
        headerName: 'Prom Vta',
        field: 'promVta',
        width: 120,
        valueFormatter: params => this.transformNumber(params.value, '1.3-3')
      },
      {
        headerName: 'Alcance',
        field: 'alcance',
        valueFormatter: params => this.transformNumber(params.value, '1.1-1')
      },
      {
        headerName: 'Pdte',
        field: 'comprasPendientes',
        valueFormatter: params => this.transformNumber(params.value, '1.3-3')
      },
      {
        headerName: 'Exis + Ped',
        field: 'alcanceMasPedido',
        valueFormatter: params => this.transformNumber(params.value, '1.3-3')
        // valueGetter: p => {
        //   const exis = p.data.existencia;
        //   const pend = p.data.comprasPendientes;
        //   const res = exis + pend;
        //   return _.round(res, 3);
        // }
      },
      {
        headerName: 'X pedir',
        field: 'porPedir',
        valueFormatter: params => this.transformNumber(params.value, '1.0-0')
      },
      {
        headerName: 'De Línea',
        field: 'deLinea',
        valueFormatter: params => (params.value ? 'SI' : 'NO')
      },
      {
        headerName: 'Proveedor',
        field: 'nombre'
      },
      {
        headerName: 'Línea',
        field: 'linea'
      },
      {
        headerName: 'Marca',
        field: 'marca'
      },
      {
        headerName: 'Clase',
        field: 'clase'
      }
    ];
  }
}
