import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { ColDef, ModelUpdatedEvent, RowSelectedEvent } from 'ag-grid-community';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { Requisicion } from 'app/cxp/model';

@Component({
  selector: 'sx-requisiciones-selector-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
      [frameworkComponents]="frameworkComponents"
    >
    </ag-grid-angular>
  `
})
export class RequisicionesSelectorTableComponent extends LxTableComponent
  implements OnInit {
  @Output() selectionChange = new EventEmitter<any[]>();

  constructor(public tableService: SxTableService) {
    super(tableService);
  }

  buildGridOptions() {
    super.buildGridOptions();
    this.gridOptions.rowSelection = 'single';
    this.gridOptions.onRowSelected = (event: RowSelectedEvent) => {
      this.selectionChange.emit(this.gridApi.getSelectedRows());
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
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  actualizarTotales() {
    if (this.gridApi) {
      let registros = 0;
      let total = 0;
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const requisicion: Partial<Requisicion> = rowNode.data;
        registros++;
        total += requisicion.total;
      });
      const res = [
        {
          folio: `Reqs: ${registros}`,
          total
        }
      ];
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Folio',
        field: 'folio',
        width: 110
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 110,
        valueFormatter: params => this.tableService.formatDate(params.value)
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        width: 70
      },
      {
        headerName: 'T.C.',
        field: 'tipoDeCambio',
        width: 80
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 150,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      }
    ];
  }
}
