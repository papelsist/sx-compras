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

@Component({
  selector: 'sx-cxp-gastos-table',
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
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdate($event)"
      >
      </ag-grid-angular>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CxpGastosTableComponent extends LxTableComponent
  implements OnInit {
  @Output()
  selectionChange = new EventEmitter<any[]>();

  constructor(public tableService: SxTableService) {
    super(tableService);
  }

  buildGridOptions() {
    super.buildGridOptions();
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.onRowSelected = (event: RowSelectedEvent) => {
      this.selectionChange.emit(this.gridApi.getSelectedRows());
    };
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true
    };
    this.gridOptions.onCellClicked = (event: CellClickedEvent) => {};
  }

  buildRowStyle(params: any) {
    /*
    if (params.data.dateReplicated) {
      return {
        color: 'rgb(20, 71, 20)'
      };
    } else {
      return {
        color: 'rgb(231, 61, 61)'
      };
    }
    */
    return '';
  }

  onModelUpdate(event: ModelUpdatedEvent) {}

  clearSelection() {
    this.gridApi.deselectAll();
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Clave',
        field: 'claveProdServ',
        width: 120
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 200
      },
      {
        headerName: 'Cant',
        field: 'cantidad',
        width: 90
      },
      {
        headerName: 'Valor U',
        field: 'valorUnitario',
        width: 100,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Importe',
        field: 'importe',
        width: 110,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Desc',
        field: 'descuento',
        width: 110,
        valueFormatter: params => this.transformCurrency(params.value)
      }
    ];
  }
}
