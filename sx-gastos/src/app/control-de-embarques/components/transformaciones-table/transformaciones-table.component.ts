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
  selector: 'sx-transformaciones-table',
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
export class TransformacionesTableComponent extends LxTableComponent
  implements OnInit {
  constructor(public tableService: SxTableService) {
    super(tableService);
  }

  buildGridOptions() {
    super.buildGridOptions();
    this.gridOptions.rowSelection = 'single';
    this.gridOptions.rowMultiSelectWithClick = true;

    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true
    };
    this.gridOptions.getRowStyle = params => this.buildRowStyle(params);
  }

  buildRowStyle(params: any) {
    if (params.data.chofer) {
      return {
        olor: 'rgb(20, 71, 20)'
      };
    } else {
      return {
        color: 'rgb(231, 61, 61)'
      };
    }
  }

  onFirstDataRendered(params) {
    this.gridOptions.api.sizeColumnsToFit();
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        width: 120
      },
      {
        headerName: 'Tipo',
        field: 'tipo',
        width: 100
      },
      {
        headerName: 'Documento',
        field: 'documento',
        width: 110
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 110,
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Fecha Inv',
        field: 'fechaInventario',
        width: 110,
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Comentario',
        field: 'comentario'
      },
      {
        headerName: 'Chofer',
        field: 'chofer',
        valueFormatter: params => {
          if (params.value) {
            return params.value.nombre;
          } else {
            return '';
          }
        }
      }
    ];
  }
}
