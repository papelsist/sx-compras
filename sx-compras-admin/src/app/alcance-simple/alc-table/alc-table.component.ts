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
  selector: 'sx-alc-table',
  templateUrl: './alc-table.component.html',
  styleUrls: ['./alc-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlcTableComponent extends LxTableComponent implements OnInit {
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

  buildColsDef(): ColDef[] | any[] {
    return [
      {
        headerName: 'Producto',
        children: [
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
            width: 250,
            pinnedRowValueFormatter: params => params.value
          },
          {
            headerName: 'Linea',
            field: 'linea',
            pinned: 'left',
            width: 130
          },
          {
            headerName: 'U',
            field: 'unidad',
            pinned: 'left',
            width: 60
          },
          {
            headerName: 'Kg',
            field: 'kilos',
            pinned: 'left',
            width: 60
          }
        ]
      },
      {
        headerName: '5 de Febrero',
        colId: '5febrero',
        children: [
          {
            headerName: 'Inventario',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['CF5FEBRERO_INV'] || 0.0;
              const i2 = params.data['SOLIS_INV'] || 0.0;
              return i1 + i2;
            },
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Venta',
            width: 110,
            field: 'CF5FEBRERO_VTA',
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Alc',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['CF5FEBRERO_INV'] || 0.0;
              const i2 = params.data['SOLIS_INV'] || 0.0;
              const vta = params.data['CF5FEBRERO_VTA'] || 0.0;
              if (vta !== 0.0) {
                return (i1 + i2) / vta;
              } else {
                return 0;
              }
            },
            valueFormatter: params => this.transformNumber(params.value)
          }
        ]
      },
      {
        headerName: 'Andrade',
        colId: 'andrade',
        children: [
          {
            headerName: 'Inventario',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['ANDRADE_INV'] || 0.0;
              // const i2 = params.data['VERTIZ_INV'] || 0.0;
              // return i1 + i2;
              return i1 ;
            },
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Venta',
            field: 'ANDRADE_VTA',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Alc',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['ANDRADE_INV'] || 0.0;
              // const i2 = params.data['VERTIZ_INV'] || 0.0;
              const vta = params.data['ANDRADE_VTA'] || 0.0;
              if (vta !== 0.0) {
                // return (i1 + i2) / vta;
                return (i1) / vta;
              } else {
                return 0;
              }
            },
            valueFormatter: params => this.transformNumber(params.value)
          }
        ]
      },
      {
        headerName: 'Bolivar',
        colId: 'bolivar',
        children: [
          {
            headerName: 'Inventario',
            field: 'BOLIVAR_INV',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Venta',
            field: 'BOLIVAR_VTA',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Alc',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['BOLIVAR_INV'] || 0.0;
              const vta = params.data['BOLIVAR_VTA'] || 0.0;
              if (vta !== 0.0) {
                return i1 / vta;
              } else {
                return 0;
              }
            },
            valueFormatter: params => this.transformNumber(params.value)
          }
        ]
      },
      {
        headerName: 'Calle 4',
        colId: 'calle4',
        children: [
          {
            headerName: 'Inventario',
            field: 'CALLE 4_INV',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Venta',
            field: 'CALLE 4_VTA',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Alc',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['CALLE 4_INV'] || 0.0;
              const vta = params.data['CALLE 4_VTA'] || 0.0;
              if (vta !== 0.0) {
                return i1 / vta;
              } else {
                return 0;
              }
            },
            valueFormatter: params => this.transformNumber(params.value)
          }
        ]
      },
      {
        headerName: 'Tacuba',
        colId: 'tacuba',
        children: [
          {
            headerName: 'Inventario',
            field: 'TACUBA_INV',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Venta',
            field: 'TACUBA_VTA',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Alc',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['TACUBA_INV'] || 0.0;
              const vta = params.data['TACUBA_VTA'] || 0.0;
              if (vta !== 0.0) {
                return i1 / vta;
              } else {
                  return 0;
                    }
                  },
            valueFormatter: params => this.transformNumber(params.value)
          }
        ]
      },
      {
        headerName: 'Vertiz 176',
        colId: 'vertiz',
        children: [
          {
            headerName: 'Inventario',
            field: 'VERTIZ 176_INV',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Venta',
            field: 'VERTIZ 176_VTA',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Alc',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['VERTIZ 176_INV'] || 0.0;
              const vta = params.data['VERTIZ 176_VTA'] || 0.0;
              if (vta !== 0.0) {
                return i1 / vta;
              } else {
                return 0;
              }
            },
      valueFormatter: params => this.transformNumber(params.value)
    }
  ]
      },
      {
        headerName: 'Zaragoza',
        colId: 'zaragoza',
        children: [
          {
            headerName: 'Inventario',
            field: 'ZARAGOZA_INV',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Venta',
            field: 'ZARAGOZA_VTA',
            width: 110,
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Alc',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['ZARAGOZA_INV'] || 0.0;
              const vta = params.data['ZARAGOZA_VTA'] || 0.0;
              if (vta !== 0.0) {
                return i1 / vta;
              } else {
                   return 0;
                    }
                  },
            valueFormatter: params => this.transformNumber(params.value)
          }
        ]
      },
      {
        headerName: 'Total',
        colId: 'total',
        children: [
          {
            headerName: 'Inventario',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['ANDRADE_INV'] || 0.0;
              const i2 = params.data['VERTIZ 176_INV'] || 0.0;
              const i3 = params.data['CF5FEBRERO_INV'] || 0.0;
              const i4 = params.data['SOLIS_INV'] || 0.0;

              const i5 = params.data['TACUBA_INV'] || 0.0;
              const i6 = params.data['CALLE 4_INV'] || 0.0;
              const i7 = params.data['BOLIVAR_INV'] || 0.0;

              const i8 = params.data['ALESA'] || 0.0;
              const i9 = params.data['VERTIZ 176_INV'] || 0.0;
              const i10 = params.data['ZARAGOZA_INV'] || 0.0;

              return i1 + i2 + i3 + i4 + i5 + i6 + i7 + i8 + i9 + i10;
            },
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Venta',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['ANDRADE_VTA'] || 0.0;
              const i2 = params.data['VERTIZ 176_VTA'] || 0.0;
              const i3 = params.data['CF5FEBRERO_VTA'] || 0.0;
              const i4 = params.data['SOLIS_VTA'] || 0.0;

              const i5 = params.data['TACUBA_VTA'] || 0.0;
              const i6 = params.data['CALLE 4_VTA'] || 0.0;
              const i7 = params.data['BOLIVAR_VTA'] || 0.0;
              const i8 = params.data['VERTIZ 176_VTA'] || 0.0;
              const i9 = params.data['ZARAGOZA_VTA'] || 0.0;
              return i1 + i2 + i3 + i4 + i5 + i6 + i7 + i8 + i9;
            },
            valueFormatter: params => this.transformNumber(params.value)
          },
          {
            headerName: 'Alc',
            width: 110,
            valueGetter: params => {
              const i1 = params.data['ANDRADE_INV'] || 0.0;
              const i2 = params.data['VERTIZ 176_INV'] || 0.0;
              const i3 = params.data['CF5FEBRERO_INV'] || 0.0;
              const i4 = params.data['SOLIS_INV'] || 0.0;
              const i5 = params.data['TACUBA_INV'] || 0.0;
              const i6 = params.data['CALLE 4_INV'] || 0.0;
              const i7 = params.data['BOLIVAR_INV'] || 0.0;
              const i8 = params.data['ALESA'] || 0.0;
              const i9 = params.data['VERTIZ 176_INV'] || 0.0;
              const i10 = params.data['ZARAGOZA_INV'] || 0.0;
              const itotal = i1 + i2 + i3 + i4 + i5 + i6 + i7 + i8 + i9 + i10;

              const v1 = params.data['ANDRADE_VTA'] || 0.0;
              const v2 = params.data['VERTIZ 176_VTA'] || 0.0;
              const v3 = params.data['CF5FEBRERO_VTA'] || 0.0;
              const v4 = params.data['SOLIS_VTA'] || 0.0;
              const v5 = params.data['TACUBA_VTA'] || 0.0;
              const v6 = params.data['CALLE 4_VTA'] || 0.0;
              const v7 = params.data['BOLIVAR_VTA'] || 0.0;
              const v8 = params.data['VERTIZ 176_VTA'] || 0.0;
              const v9 = params.data['ZARAGOZA_VTA'] || 0.0;
              const vtotal = v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8 + v9;

              if (vtotal !== 0.0) {
                return itotal / vtotal;
              } else {
                return 0;
              }
            },
            valueFormatter: params => this.transformNumber(params.value)
          }
        ]
      },
    ]
  }
}