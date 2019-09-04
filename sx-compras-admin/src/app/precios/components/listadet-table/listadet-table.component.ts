import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';

import {
  ColDef,
  ModelUpdatedEvent,
  RowSelectedEvent,
  ColGroupDef,
  CellEditingStoppedEvent
} from 'ag-grid-community';
import { ListaDePreciosVentaDet } from 'app/precios/models';

import * as _ from 'lodash';

@Component({
  selector: 'sx-listadet-table',
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
        rowSelection="multiple"
        [rowMultiSelectWithClick]="true"
        [enterMovesDownAfterEdit]="true"
      >
      </ag-grid-angular>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListadetTableComponent extends LxTableComponent
  implements OnInit, OnChanges {
  @Output() selectionChange = new EventEmitter<any[]>();
  @Input() selection: any[] = [];
  @Output() edited = new EventEmitter();

  constructor(public tableService: SxTableService) {
    super(tableService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      if (this.gridApi) {
        this.setRowData(changes.partidas.currentValue);
      }
    }
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
      width: 110,
      sortable: true,
      resizable: true,
      pinnedRowCellRenderer: r => ''
    };
    this.gridOptions.onCellEditingStopped = (
      event: CellEditingStoppedEvent
    ) => {
      this.edited.emit(event.data);
    };
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }

  onModelUpdate(event: ModelUpdatedEvent) {
    if (this.gridApi) {
      this.actualizarTotales();
      // this.gridApi.sizeColumnsToFit();
    }
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  actualizarTotales() {
    let registros = 0;

    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const row: Partial<ListaDePreciosVentaDet> = rowNode.data;
        registros++;
      });
    }
    const res = [
      {
        clave: `Registros: ${registros}`
      }
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  buildColsDef(): ColGroupDef[] {
    return [
      {
        headerName: 'PRODUCTO',
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
            width: 270,
            pinned: 'left'
          },
          {
            headerName: 'Linea',
            field: 'linea',
            width: 130,
            pinned: 'left'
          },
          {
            headerName: 'Costo',
            field: 'costo',
            valueFormatter: params => this.transformCurrency(params.value),
            pinned: 'left'
          }
        ]
      },
      {
        headerName: 'CONTADO',
        children: [
          {
            headerName: 'P. Anterior',
            field: 'precioAnteriorContado',
            valueFormatter: params => this.transformCurrency(params.value)
          },
          {
            headerName: 'Precio',
            field: 'precioContado',
            editable: true,
            valueFormatter: params => this.transformCurrency(params.value)
          },
          {
            headerName: 'Var (%)',
            colId: 'contadoPer',
            valueFormatter: params => this.transformPercent(params.value),
            valueGetter: params => {
              const pa = params.data.precioAnteriorContado;
              const pn = params.data.precioContado;
              if (pn === 0) {
                return 0;
              }
              const dif = pn - pa;
              const incremento = dif / pa;
              return incremento;
            }
          },
          {
            headerName: 'Factor',
            field: 'factorContado',
            width: 90
          }
        ]
      },
      {
        headerName: 'CREDITO',
        children: [
          {
            headerName: 'P. Anterior',
            field: 'precioAnteriorCredito',
            valueFormatter: params => this.transformCurrency(params.value)
          },
          {
            headerName: 'Precio',
            field: 'precioCredito',
            editable: true,
            valueFormatter: params => this.transformCurrency(params.value)
          },
          {
            headerName: 'Var (%)',
            colId: 'contadoPer',
            valueFormatter: params => this.transformPercent(params.value),
            valueGetter: params => {
              const pa = params.data.precioAnteriorCredito;
              const pn = params.data.precioCredito;
              if (pn === 0) {
                return 0;
              }
              const dif = pn - pa;
              const incremento = dif / pa;
              return incremento;
            }
          },
          {
            headerName: 'Fact',
            field: 'factorCredito',
            width: 90
          }
        ]
      },
      {
        headerName: 'OTROS',
        children: [
          {
            headerName: 'Costo U',
            field: 'costoUltimo',
            valueFormatter: params => this.transformCurrency(params.value)
          },

          ///
          {
            headerName: 'Clase',
            field: 'clase',
            width: 100
          },
          {
            headerName: 'Marca',
            field: 'marca',
            width: 100
          }
        ]
      }
    ];
  }
}
