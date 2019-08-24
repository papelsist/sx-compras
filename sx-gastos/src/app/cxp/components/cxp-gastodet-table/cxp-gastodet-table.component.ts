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
import { GastoDet } from 'app/cxp/model';

@Component({
  selector: 'sx-cxp-gastosdet-table',
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
        [rowMultiSelectWithClick]="true"
      >
      </ag-grid-angular>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CxpGastosDetTableComponent extends LxTableComponent
  implements OnInit {
  @Output()
  selectionChange = new EventEmitter<GastoDet[]>();

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

  clearSelection() {
    this.gridApi.deselectAll();
  }
  onModelUpdate(event: ModelUpdatedEvent) {
    if (this.gridApi) {
      this.actualizarTotales();
    }
  }

  actualizarTotales() {
    let registros = 0;
    let importe = 0;
    this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
      const con: Partial<GastoDet> = rowNode.data;
      registros++;
      importe += con.importe;
    });
    const res = [
      {
        descripcion: `Registros: ${registros}`,
        importe
      }
    ];
    this.gridApi.setPinnedBottomRowData(res);
  }
  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }

  buildColsDef(): any[] {
    return [
      {
        headerName: 'Cuenta',
        field: 'cuentaContable',
        width: 170,
        valueGetter: params => {
          if (!params.node.isRowPinned()) {
            return params.data.cuentaContable.clave;
          }
          return '';
        },
        pinned: 'left'
      },
      {
        headerName: 'Descripción (CFDI)',
        field: 'cfdiDescripcion',
        width: 250,
        pinned: 'left'
      },
      {
        headerName: 'Producto',
        field: 'descripcion',
        width: 250
      },
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        width: 110,
        valueGetter: params => {
          if (params.data.sucursal) {
            return params.data.sucursal.nombre;
          }
          return '';
        }
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
      },
      {
        headerName: 'ISR (ret)',
        field: 'isrRetenido',
        width: 100,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'IVA (ret)',
        field: 'ivaRetenido',
        width: 100,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'IVA (trs)',
        field: 'ivaTrasladado',
        width: 100,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Activo Fijo',
        children: [
          {
            headerName: 'AF',
            field: 'activoFijo',
            width: 80,
            valueFormatter: params => (params.value ? 'S' : 'N')
          },
          {
            headerName: 'Modelo',
            field: 'modelo'
          },
          {
            headerName: 'Serie',
            field: 'serie'
          }
        ]
      },
      {
        headerName: 'Fletes',
        children: [
          {
            headerName: 'Prestamo',
            field: 'facturistaPrestamo',
            valueFormatter: params => this.transformCurrency(params.value)
          },
          {
            headerName: 'Vales',
            field: 'facturistaVales',
            valueFormatter: params => this.transformCurrency(params.value)
          },
          {
            headerName: 'Cargos',
            field: 'facturistaCargos',
            valueFormatter: params => this.transformCurrency(params.value)
          }
        ]
      }
    ];
  }
}
