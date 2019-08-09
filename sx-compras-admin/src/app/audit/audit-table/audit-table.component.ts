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
  selector: 'sx-audit-table',
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
  styleUrls: ['./audit-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditTableComponent extends LxTableComponent implements OnInit {
  @Output() selectionChange = new EventEmitter<any[]>();

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
      resizable: true,
      pinnedRowValueFormatter: params => ''
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
    let cantidad = 0;
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const exis = rowNode.data;
        registros++;
        cantidad += exis.cantidad;
      });
    }
    const res = [
      {
        descripcion: `Registros: ${registros}`,
        cantidad
      }
    ];

    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Id',
        field: 'id'
      },
      {
        headerName: 'Tabla',
        field: 'tableName'
      },
      {
        headerName: 'Origen',
        field: 'source'
      },
      {
        headerName: 'Destino',
        field: 'target'
      },
      {
        headerName: 'Entidad ID',
        field: 'persistedObjectId'
      },
      {
        headerName: 'Tipo',
        field: 'eventName'
      },
      {
        headerName: 'Mensage',
        field: 'message'
      },
      {
        headerName: 'Creado',
        field: 'dateCreated'
      },
      {
        headerName: 'Replicado',
        field: 'dateReplicated'
      }
    ];
  }
}
