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
    <div style="height: 500px">
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
      resizable: true
    };
    this.gridOptions.onCellClicked = (event: CellClickedEvent) => {};
  }

  buildRowStyle(params: any) {
    if (params.data.dateReplicated) {
      return {
        color: 'rgb(20, 71, 20)'
      };
    } else {
      return {
        color: 'rgb(231, 61, 61)'
      };
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

  replicados(value: boolean) {
    const filterInstance = this.gridApi.getFilterInstance('dateReplicated');
    if (value) {
      filterInstance.setModel({
        type: 'endsWith',
        filter: 'Z'
      });
    } else {
      filterInstance.setModel(null);
    }
    this.gridApi.onFilterChanged();
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Id',
        field: 'id',
        width: 120
      },
      {
        headerName: 'Creado',
        field: 'dateCreated',
        valueFormatter: params =>
          this.transformDate(params.value, 'MMM-dd :HH:mm')
      },
      {
        headerName: 'Tipo',
        field: 'eventName'
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
        headerName: 'Replicado',
        field: 'dateReplicated',
        valueFormatter: params =>
          this.transformDate(params.value, 'MMM-dd: HH:mm')
        // filter: 'agDateColumnFilter'
      },
      {
        headerName: 'Mensage',
        field: 'message'
      },
      {
        headerName: 'Entidad ID',
        field: 'persistedObjectId'
      }
    ];
  }
}
