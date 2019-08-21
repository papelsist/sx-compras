import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';

import { ColDef, ModelUpdatedEvent, RowSelectedEvent } from 'ag-grid-community';

@Component({
  selector: 'sx-productos-table2',
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
        [localeText]="localeText"
        (firstDataRendered)="onFirstDataRendered($event)"
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdate($event)"
        [frameworkComponents]="frameworkComponents"
      >
      </ag-grid-angular>
    </div>
  `
})
export class ProductosTable2Component extends LxTableComponent
  implements OnInit {
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
      pinnedRowCellRenderer: r => ''
    };
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    } else if (!params.data.activo) {
      return { color: 'red' };
    }
    return {};
  }

  onModelUpdate(event: ModelUpdatedEvent) {
    if (this.gridApi) {
      this.actualizarTotales();
    }
  }

  actualizarTotales() {
    let registros = 0;
    this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
      registros++;
    });
    const res = [
      {
        descripcion: `Productos: ${registros}`
      }
    ];
    this.gridApi.setPinnedBottomRowData(res);
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Clave',
        field: 'clave',
        width: 115,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 270,
        pinned: 'left',
        pinnedRowCellRenderer: params => params.value
      },
      {
        headerName: 'U',
        field: 'unidad',
        width: 60
      },
      {
        headerName: 'Estado',
        field: 'activo',
        width: 110,
        valueFormatter: params => (params.data.activo ? 'A' : 'S')
      },
      {
        headerName: 'Kg',
        field: 'kilos',
        width: 100
      },
      {
        headerName: 'P. Contado',
        field: 'precioContado',
        width: 110,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'P. Crédito',
        field: 'precioCredito',
        width: 110,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Línea',
        field: 'linea',
        valueGetter: params => {
          if (params.data.linea) {
            return params.data.linea.linea;
          } else {
            return 'ND';
          }
        }
      },
      {
        headerName: 'Marca',
        field: 'maraca',
        valueGetter: params => {
          if (params.data.marca) {
            return params.data.marca.marca;
          } else {
            return 'ND';
          }
        }
      },
      {
        headerName: 'Clase',
        field: 'clase',
        valueGetter: params => {
          if (params.data.clase) {
            return params.data.clase.clase;
          } else {
            return 'ND';
          }
        }
      },
      {
        headerName: 'Usuario',
        field: 'updateUser',
        width: 120
      },
      {
        headerName: 'Actualizada',
        field: 'lastUpdated',
        cellRenderer: params =>
          this.transformDate(params.value, 'dd/MM/yyyy HH:mm')
      }
    ];
  }
}
