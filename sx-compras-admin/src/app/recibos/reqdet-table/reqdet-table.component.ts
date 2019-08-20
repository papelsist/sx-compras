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
  selector: 'sx-reqdet-table',
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
export class ReqdetTableComponent extends LxTableComponent implements OnInit {
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
    this.actualizarTotales();
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  actualizarTotales() {
    let registros = 0;
    let impPagado = 0;
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const det: Partial<ReciboDet> = rowNode.data;
        registros++;
        impPagado += det.impPagado;
      });
    }
    const res = [
      {
        UUID: `Registros: ${registros}`,
        ImpPagado: impPagado
      }
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'UUID',
        field: 'uuid',
        width: 190,
        pinned: 'left'
      },
      {
        headerName: 'Serie',
        field: 'documentoSerie',
        width: 100
      },
      {
        headerName: 'Folio',
        field: 'documentoFolio',
        width: 100
      },
      {
        headerName: 'Importe',
        field: 'apagar',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Factura',
        field: 'cxp',
        valueFormatter: params => (params.value ? 'OK' : 'FALTA'),
        width: 70
      }
    ];
  }
}
