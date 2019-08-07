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
import { Recibo } from '../models';

@Component({
  selector: 'sx-recibos-table',
  templateUrl: './recibos-table.component.html',
  styleUrls: ['./recibos-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecibosTableComponent extends LxTableComponent implements OnInit {
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() xml = new EventEmitter();
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
      width: 150,
      sortable: true,
      resizable: true,
      pinnedRowCellRenderer: r => '',
      pinnedRowValueFormatter: r => ''
    };
    this.gridOptions.onCellClicked = (event: CellClickedEvent) => {
      if (event.column.getId() === 'xml') {
        this.xml.emit(event.data);
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

    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const lista: Partial<Recibo> = rowNode.data;
        registros++;
      });
    }
    const res = [
      {
        Id: `Registros: ${registros}`
      }
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Id',
        field: 'id',
        width: 90,
        pinned: 'left'
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 110,
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Emisor',
        field: 'emisor',
        width: 250
      },
      {
        headerName: 'Requisicion',
        field: 'requisicion',
        valueGetter: params => (params.data.requisicion ? 'OK' : 'PENDIENTE')
      },
      {
        headerName: 'UUID',
        field: 'uuid',
        width: 90,
        valueFormatter: params => params.value.substring(0, 5)
      },
      {
        headerName: '# Operacion',
        field: 'numOperacion',
        width: 110
      },
      {
        headerName: 'F.P',
        field: 'formaDePagoP',
        width: 80
      },
      {
        headerName: 'Monto',
        field: 'monto',
        width: 120
      },
      {
        headerName: 'F. Pago',
        field: 'fechaPago',
        valueFormatter: params => this.transformDate(params.value),
        width: 110
      },
      {
        headerName: 'Revisión',
        field: 'revision',
        valueFormatter: params => this.transformDate(params.value),
        width: 110
      },
      {
        headerName: 'XML',
        field: 'id',
        colId: 'xml',
        cellRenderer: params => 'XML',
        filter: false,
        width: 70
      },
      {
        headerName: 'Usuario',
        field: 'updateUser',
        width: 110
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
