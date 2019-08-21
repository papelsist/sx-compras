import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { RowSelectedEvent, ColDef, ModelUpdatedEvent } from 'ag-grid-community';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { ProveedorProducto } from '../../models/proveedorProducto';

@Component({
  selector: 'sx-proveedor-productos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  `
})
export class ProveedorProductosTableComponent extends LxTableComponent
  implements OnInit {
  @Output() selectionChange = new EventEmitter<ProveedorProducto[]>();

  constructor(public tableService: SxTableService) {
    super(tableService);
  }

  ngOnInit() {}
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
      width: 140,
      sortable: true,
      resizable: true,
      pinnedRowCellRenderer: r => '',
      pinnedRowValueFormatter: r => ''
    };
  }

  onModelUpdate(event: ModelUpdatedEvent) {
    this.actualizarTotales();
  }

  actualizarTotales() {
    if (this.gridApi) {
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
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Clave',
        field: 'clave',
        width: 120,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 220,
        pinned: 'left',
        pinnedRowCellRenderer: params => params.value
      },
      {
        headerName: 'U',
        field: 'unidad',
        width: 80
      },
      {
        headerName: 'Desc Proveedor',
        field: 'claveProveedor',
        width: 250,
        valueGetter: params =>
          `(${params.data.claveProveedor}) ${params.data.descripcionProveedor}`
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        width: 80
      },
      {
        headerName: 'P. Bruto',
        field: 'precioBruto',
        width: 110,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Desc1',
        field: 'desc1',
        width: 90
      },
      {
        headerName: 'Desc2',
        field: 'desc2',
        width: 90
      },
      {
        headerName: 'Desc3',
        field: 'desc3',
        width: 90
      },
      {
        headerName: 'Desc4',
        field: 'desc4',
        width: 90
      },
      {
        headerName: 'Precio',
        field: 'precio',
        width: 110,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Actualizada',
        field: 'lastUpdated',
        valueFormatter: params =>
          this.transformDate(params.value, 'dd/MM/yyyy HH:mm'),
        width: 110
      }
    ];
  }
}
