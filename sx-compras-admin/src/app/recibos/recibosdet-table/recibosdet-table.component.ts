import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';

import {
  ColDef,
  ModelUpdatedEvent,
  RowSelectedEvent,
  CellClickedEvent
} from 'ag-grid-community';
import { ReciboDet } from '../models';

@Component({
  selector: 'sx-recibosdet-table',
  template: `
    <div style="height: 100%">
      <ag-grid-angular
        #agGrid
        class="ag-theme-balham"
        style="width: 100%; height: 100%;"
        [gridOptions]="gridOptions"
        [defaultColDef]="defaultColDef"
        [floatingFilter]="false"
        [localeText]="localeText"
        (firstDataRendered)="onFirstDataRendered($event)"
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdate($event)"
      >
      </ag-grid-angular>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecibosdetTableComponent extends LxTableComponent
  implements OnInit {
  @Output() selectionChange = new EventEmitter<any[]>();

  constructor(public tableService: SxTableService) {
    super(tableService);
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
      pinnedRowCellRenderer: r => '',
      pinnedRowValueFormatter: r => ''
    };
    this.gridOptions.onCellClicked = (event: CellClickedEvent) => {};
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }

  onModelUpdate(event: ModelUpdatedEvent) {
    if (this.gridApi) {
      this.actualizarTotales();
    }
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  actualizarTotales() {
    let registros = 0;
    let impPagado = 0;
    this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
      const det: Partial<ReciboDet> = rowNode.data;
      registros++;
      impPagado += det.impPagado;
    });
    const res = [
      {
        idDocumento: `CFDIs: ${registros}`,
        ImpPagado: impPagado
      }
    ];
    this.gridApi.setPinnedBottomRowData(res);
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'UUID',
        field: 'idDocumento',
        width: 150,
        pinned: 'left',
        pinnedRowCellRenderer: p => p.value
      },
      {
        headerName: 'Folio',
        field: 'folio',
        width: 100
      },
      {
        headerName: 'Serie',
        field: 'serie',
        width: 100
      },
      {
        headerName: 'MetodoDePagoDR',
        field: 'metodoDePagoDR'
      },
      {
        headerName: 'ImpSaldoAnt',
        field: 'impSaldoAnt',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'ImpPagado',
        field: 'impPagado',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'ImpSaldoInsoluto',
        field: 'impSaldoInsoluto',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Factura',
        field: 'cxp',
        valueFormatter: params => (params.value ? 'OK' : 'FALTA'),
        width: 70
      },
      {
        headerName: 'NumParcialidad',
        field: 'numParcialidad'
      },
      {
        headerName: 'MonedaDR',
        field: 'monedaDR'
      }
    ];
  }
}
