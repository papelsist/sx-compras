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

import { Existencia } from '../../models';

@Component({
  selector: 'sx-existencias-table',
  templateUrl: './existencias-table.component.html',
  styleUrls: ['./existencias-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExistenciasTableComponent extends LxTableComponent
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

  buildColsDef(): ColDef[] {
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
        headerName: 'Linea',
        field: 'linea',
        pinned: 'left',
        width: 130
      },
      {
        headerName: 'U',
        field: 'unidad',
        width: 60
      },
      {
        headerName: 'Kg',
        field: 'kilos',
        width: 60
      },
      {
        headerName: 'G',
        field: 'gramos',
        width: 60
      },
      {
        headerName: 'Andrade',
        field: 'ANDRADE',
        width: 110,
        valueFormatter: params => this.transformNumber(params.value, '1.1-3')
      },
      {
        headerName: 'Bolivar',
        field: 'BOLIVAR',
        width: 110,
        valueFormatter: params => this.transformNumber(params.value, '1.1-3')
      },
      {
        headerName: 'Tacuba',
        field: 'TACUBA',
        width: 110,
        valueFormatter: params => this.transformNumber(params.value, '1.1-3')
      },
      {
        headerName: '5Febrero',
        field: 'CF5FEBRERO',
        width: 110,
        valueFormatter: params => this.transformNumber(params.value, '1.1-3')
      },
      {
        headerName: 'Calle 4',
        field: 'CALLE 4',
        width: 110,
        valueFormatter: params => this.transformNumber(params.value, '1.1-3')
      },
      {
        headerName: 'Vertiz',
        field: 'VERTIZ 176',
        width: 110,
        valueFormatter: params => this.transformNumber(params.value, '1.1-3')
      },
      {
        headerName: 'Solis',
        field: 'SOLIS',
        width: 110,
        valueFormatter: params => this.transformNumber(params.value, '1.1-3')
      },
      {
        headerName: 'Alesa',
        field: 'ALESA',
        width: 110,
        valueFormatter: params => this.transformNumber(params.value, '1.1-3')
      },
      {
        headerName: 'Total',
        field: 'cantidad',
        valueFormatter: params => this.transformNumber(params.value, '1.1-3')
      }
    ];
  }
}
