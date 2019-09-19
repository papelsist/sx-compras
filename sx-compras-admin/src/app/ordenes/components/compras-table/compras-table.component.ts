import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';

import {
  ColDef,
  ModelUpdatedEvent,
  RowSelectedEvent,
  GridReadyEvent,
  FilterChangedEvent
} from 'ag-grid-community';

import { Compra } from 'app/ordenes/models/compra';

@Component({
  selector: 'sx-compras-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compras-table.component.html',
  styleUrls: ['./compras-table.component.scss']
})
export class ComprasTableComponent extends LxTableComponent implements OnInit {
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() print = new EventEmitter();

  @Output() filterChange = new EventEmitter();
  @Input() filterModel: any;

  @Input() columnState: any;
  @Output() columnStateChanged = new EventEmitter();

  @Input() sortModel: any;
  @Output() sortModelChanged = new EventEmitter();

  constructor(public tableService: SxTableService) {
    super(tableService);
  }

  buildGridOptions() {
    super.buildGridOptions();
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.onRowSelected = (event: RowSelectedEvent) => {
      this.selectionChange.emit(this.gridApi.getSelectedRows());
    };
  }

  setFilterModel(model: any) {
    this.gridApi.setFilterModel(model);
    this.gridApi.onFilterChanged();
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }

  onModelUpdate(event: ModelUpdatedEvent) {
    this.actualizarTotales();
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.setRowData(this.partidas);

    if (this.filterModel && this.gridApi) {
      this.gridApi.setFilterModel(this.filterModel);
    }
    this.gridOptions.onFilterChanged = (event: FilterChangedEvent) => {
      if (this.gridApi) {
        this.filterChange.emit(event.api.getFilterModel());
      }
    };

    if (this.columnState && this.columnState) {
      this.columnApi.setColumnState(this.columnState);
    }
    this.gridOptions.onColumnMoved = event => {
      this.columnStateChanged.emit(event.columnApi.getColumnState());
    };

    if (this.sortModel && this.columnState) {
      this.gridApi.setSortModel(this.sortModel);
    }
    this.gridOptions.onColumnResized = event => {
      this.columnStateChanged.emit(event.columnApi.getColumnState());
    };

    this.gridOptions.onSortChanged = event => {
      this.sortModelChanged.emit(event.api.getSortModel());
    };
  }

  actualizarTotales() {
    let registros = 0;

    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const compra: Partial<Compra> = rowNode.data;
        registros++;
      });
    }
    const res = [
      {
        nombre: `Compras: ${registros}`
      }
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  /**
   * displayColumns = [


    'pendiente',
  ];
   */

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Sucursal',
        field: 'sucursalNombre',
        width: 115,
        pinned: 'left'
      },
      {
        headerName: 'Proveedor',
        field: 'nombre',
        width: 300,
        pinned: 'left'
      },
      {
        headerName: 'Compra',
        field: 'folio',
        width: 110
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 100,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Entrega',
        field: 'entrega',
        width: 100,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        width: 70
      },
      {
        headerName: 'TC',
        field: 'tipoDeCambio',
        maxWidth: 60,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Total',
        field: 'totalMn',
        width: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Usuario',
        field: 'lastUpdatedBy',
        width: 120
      },
      {
        headerName: 'Pendiente',
        field: 'pendientes',
        width: 120
      },
      {
        headerName: 'Actualizada',
        field: 'modificada',
        cellRenderer: params =>
          this.transformDate(params.value, 'dd/MM/yyyy HH:mm')
      },
      {
        headerName: 'Depurada',
        field: 'ultimaDepuracion',
        width: 120,
        cellRenderer: params => this.transformDate(params.value, 'dd/MM/yyyy')
      },
      {
        headerName: 'Cerrada',
        field: 'cerrada',
        width: 120,
        cellRenderer: params => this.transformDate(params.value, 'dd/MM/yyyy')
      },
      {
        headerName: 'Estatus',
        field: 'status',
        width: 120
      },
      {
        headerName: 'P',
        colId: 'print',
        cellRenderer: 'printRenderer',
        onCellClicked: params => this.print.emit(params.data),
        width: 90
      },
      {
        headerName: 'Comentario',
        field: 'comentario'
      }
    ];
  }
}
