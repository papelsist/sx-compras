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
import { ListaDePreciosVenta } from '../../models';

@Component({
  selector: 'sx-listas-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './listas-grid.component.html',
  styleUrls: ['./listas-grid.component.scss']
})
export class ListasGridComponent extends LxTableComponent implements OnInit {
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
        const lista: Partial<ListaDePreciosVenta> = rowNode.data;
        registros++;
      });
    }
    const res = [
      {
        nombre: `Registros: ${registros}`
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
        width: 115,
        pinned: 'left'
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 100,
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Moneda',
        field: 'moneda',
        width: 90
      },
      {
        headerName: 'T.C',
        field: 'tipoDeCambio',
        width: 90
      },
      {
        headerName: 'Linea',
        field: 'linea',
        width: 150
      },
      {
        headerName: 'Descripción',
        field: 'descripcion'
      },
      {
        headerName: 'Aplicada',
        field: 'aplicada',
        valueFormatter: params =>
          this.transformDate(params.value, 'dd/MM/yyyy HH:mm')
      },
      {
        headerName: 'Usuario',
        field: 'updateUser',
        width: 120
      },
      {
        headerName: 'Actualizada',
        field: 'lastUpdated',
        valueFormatter: params =>
          this.transformDate(params.value, 'dd/MM/yyyy HH:mm')
      }
    ];
  }
}
