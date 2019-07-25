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
import { RequisicionDeMaterial } from '../../models';

@Component({
  selector: 'sx-requisiciones-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './requisiciones-table.component.html',
  styleUrls: ['./requisiciones-table.component.scss']
})
export class RequisicionesTableComponent extends LxTableComponent
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
        const requisicion: Partial<RequisicionDeMaterial> = rowNode.data;
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
        headerName: 'Sucursal',
        field: 'sucursal',
        width: 115,
        pinned: 'left'
      },
      {
        headerName: 'Folio',
        field: 'folio',
        width: 110
      },
      {
        headerName: 'Proveedor',
        field: 'proveedor',
        width: 300,
        pinned: 'left'
      },
      {
        headerName: 'Clave',
        field: 'clave',
        width: 110
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 100,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Moneda',
        field: 'moneda',
        width: 90
      },
      {
        headerName: 'Comentario',
        field: 'comentario'
      },
      {
        headerName: 'Usuario',
        field: 'updateUser',
        width: 120
      },
      {
        headerName: 'Actualizada por',
        field: 'updateUser',
        width: 120
      },
      {
        headerName: 'Creada',
        field: 'dateCreated',
        cellRenderer: params =>
          this.transformDate(params.value, 'dd/MM/yyyy HH:mm')
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
