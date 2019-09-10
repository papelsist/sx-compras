import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  LxTableComponent,
  NumericCellEditorComponent
} from 'app/_shared/components';

import {
  ColDef,
  ModelUpdatedEvent,
  RowSelectedEvent,
  CellClickedEvent,
  ColGroupDef,
  CellEditingStoppedEvent,
  RowDoubleClickedEvent
} from 'ag-grid-community';

import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { GastoDet } from 'app/cxp/model';

import * as _ from 'lodash';

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
        [enterMovesDownAfterEdit]="true"
        [enterMovesDown]="true"
        [frameworkComponents]="frameworkComponents"
      >
      </ag-grid-angular>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CxpGastosDetTableComponent extends LxTableComponent
  implements OnInit, OnChanges {
  @Output()
  selectionChange = new EventEmitter<GastoDet[]>();

  @Output()
  edit = new EventEmitter<Partial<GastoDet>>();

  public frameworkComponents;

  constructor(public tableService: SxTableService) {
    super(tableService);
    this.frameworkComponents = {
      numericCellEditor: NumericCellEditorComponent
    };
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
      suppressNavigable: true
    };
    this.gridOptions.onCellClicked = (event: CellClickedEvent) => {};
    this.gridOptions.onCellEditingStopped = (
      event: CellEditingStoppedEvent
    ) => {
      if (
        event.column.getColId() === 'cantidad' ||
        event.column.getColId() === 'valorUnitario'
      ) {
        // Importes
        this.gastoActualizado(event.data);
      }
    };
  }

  private gastoActualizado(gasto: Partial<GastoDet>) {
    const imp = _.round(gasto.cantidad * gasto.valorUnitario, 2);
    gasto.importe = imp;
    const { id, cantidad, valorUnitario, importe } = gasto;
    this.edit.emit({ id, cantidad, valorUnitario, importe });
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  onModelUpdate(event: ModelUpdatedEvent) {
    if (this.gridApi) {
      this.actualizarTotales();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      // console.log('Partidas: ', changes.partidas.currentValue);
      if (this.gridApi) {
        this.setRowData(changes.partidas.currentValue);
      }
    }
  }

  actualizarTotales() {
    let registros = 0;
    let importe = 0;
    let ivaRetenido = 0;
    let ivaTrasladado = 0;
    let isrRetenido = 0;
    this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
      const con: Partial<GastoDet> = rowNode.data;
      registros++;
      importe += con.importe;
      ivaRetenido += con.ivaRetenido;
      ivaTrasladado += con.ivaTrasladado;
      isrRetenido += con.isrRetenido;
    });
    const res = [
      {
        descripcion: `Registros: ${registros}`,
        importe,
        ivaRetenido,
        ivaTrasladado,
        isrRetenido
      }
    ];
    this.gridApi.setPinnedBottomRowData(res);
  }
  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    } else if (!params.node.data.cuentaContable) {
      return { color: 'red' };
    }
    return {};
  }

  toogleCuentaDesc(val: boolean) {
    this.columnApi.setColumnVisible('cuentaContableDescripcion', val);
  }

  /**
   *  ColDef or GroupColDef
   */
  buildColsDef(): any[] {
    return [
      {
        headerName: 'Cuenta',
        field: 'cuentaContable',
        width: 170,
        valueGetter: params => {
          if (!params.node.isRowPinned() && params.data.cuentaContable) {
            return params.data.cuentaContable.clave;
          }
          return '';
        },
        tooltipValueGetter: params => {
          if (!params.node.isRowPinned() && params.data.cuentaContable) {
            return params.data.cuentaContable.descripcion;
          }
          return '';
        },
        pinned: 'left'
      },
      {
        headerName: 'Cta Desc',
        colId: 'cuentaContableDescripcion',
        width: 200,
        valueGetter: params => {
          if (!params.node.isRowPinned() && params.data.cuentaContable) {
            return params.data.cuentaContable.descripcion;
          }
          return '';
        },
        hide: false,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        field: 'cfdiDescripcion',
        width: 250,
        pinned: 'left'
      },
      {
        headerName: 'Sucursal',
        field: 'sucursalNombre',
        width: 110
      },
      {
        headerName: 'Cant',
        field: 'cantidad',
        width: 90,
        // cellEditor: 'numericCellEditor',
        editable: true,
        suppressNavigable: false
      },
      {
        headerName: 'Valor U',
        field: 'valorUnitario',
        width: 100,
        editable: true,
        suppressNavigable: false,
        // cellEditor: 'numericCellEditor',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Importe',
        field: 'importe',
        width: 110,
        valueFormatter: params => this.transformCurrency(params.value),
        suppressNavigable: true
      },
      {
        headerName: 'IVA Trasladado',
        children: [
          {
            headerName: 'Tasa',
            field: 'ivaTrasladadoTasa',
            width: 100,
            cellRenderer: params => this.transformPercent(params.value),
            pinnedRowCellRenderer: params => ''
          },
          {
            headerName: 'Importe',
            field: 'ivaTrasladado',
            width: 100,
            cellRenderer: params => this.transformCurrency(params.value)
          }
        ]
      },
      {
        headerName: 'IVA Retenido',
        children: [
          {
            headerName: 'Tasa',
            field: 'ivaRetenidoTasa',
            width: 100,
            cellRenderer: params => this.transformPercent(params.value),
            pinnedRowCellRenderer: params => ''
          },
          {
            headerName: 'Importe',
            field: 'ivaRetenido',
            width: 100,
            cellRenderer: params => this.transformCurrency(params.value)
          }
        ]
      },
      {
        headerName: 'ISR Retenido',
        children: [
          {
            headerName: 'Tasa',
            field: 'isrRetenidoTasa',
            width: 100,
            cellRenderer: params => this.transformPercent(params.value),
            pinnedRowCellRenderer: params => ''
          },
          {
            headerName: 'Importe',
            field: 'isrRetenido',
            width: 100,
            cellRenderer: params => this.transformCurrency(params.value)
          }
        ]
      },
      {
        headerName: 'Desc',
        field: 'descuento',
        width: 110,
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
      }
    ];
  }
}
