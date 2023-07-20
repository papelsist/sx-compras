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
  CellClickedEvent,
  ColGroupDef
} from 'ag-grid-community';

import { Existencia } from '../../models';

@Component({
  selector: 'sx-ventas-grid',
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
    >
    </ag-grid-angular>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VentasGridComponent extends LxTableComponent implements OnInit {
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
    this.gridOptions.onCellClicked = (event: CellClickedEvent) => {
      if (event.column.getId() === 'xml') {
      }
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

  // buildColsDef(): ColDef[] | ColGroupDef[] {
  buildColsDef() {
    return [
      {
        headerName: 'Clave',
        field: 'clave',
        width: 110,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        pinned: 'left',
        width: 310
      },
      {
        headerName: 'Grupo',
        field: 'grupo',
        pinned: 'left',
        width: 130
      },
      {
        headerName: 'Linea',
        field: 'linea',
        width: 130
      },
      {
        headerName: 'Marca',
        field: 'marca',
        width: 120
      },
      {
        headerName: 'Clase',
        field: 'clase',
        width: 120
      },
      {
        headerName: 'U',
        field: 'unidad',
        width: 60
      },
      {
        headerName: 'Kg',
        field: 'kgXmillar',
        width: 100
      },
      {
        headerName: 'G',
        field: 'gramos',
        width: 60
      },
      {
        headerName: 'Andrade',
        children: [
          {
            headerName: 'Cantidad',
            field: 'andradeCantidad',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          },
          {
            headerName: 'Kilos',
            field: 'andradeKilos',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          }
        ]
      },
      {
        headerName: 'Bolivar',
        children: [
          {
            headerName: 'Cantidad',
            field: 'bolivarCantidad',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          },
          {
            headerName: 'Kilos',
            field: 'bolivarKilos',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          }
        ]
      },
      {
        headerName: 'Tacuba',
        children: [
          {
            headerName: 'Cantidad',
            field: 'tacubaCantidad',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          },
          {
            headerName: 'Kilos',
            field: 'tacubaKilos',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          }
        ]
      },
      {
        headerName: '5Febrero',
        children: [
          {
            headerName: 'Cantidad',
            field: 'cf5febreroCantidad',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          },
          {
            headerName: 'Kilos',
            field: 'cf5febreroKilos',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          }
        ]
      },
      {
        headerName: 'Calle4',
        children: [
          {
            headerName: 'Cantidad',
            field: 'calle4Cantidad',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          },
          {
            headerName: 'Kilos',
            field: 'calle4Kilos',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          }
        ]
      },
      {
        headerName: 'Vertiz',
        children: [
          {
            headerName: 'Cantidad',
            field: 'vertizCantidad',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          },
          {
            headerName: 'Kilos',
            field: 'vertizKilos',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          }
        ]
      },
      {
        headerName: 'Zaragoza',
        children: [
          {
            headerName: 'Cantidad',
            field: 'zaragozaCantidad',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          },
          {
            headerName: 'Kilos',
            field: 'zaragozaKilos',
            width: 110,
            valueFormatter: params =>
              this.transformNumber(params.value, '1.1-3')
          }
        ]
      }
    ];
  }
}
