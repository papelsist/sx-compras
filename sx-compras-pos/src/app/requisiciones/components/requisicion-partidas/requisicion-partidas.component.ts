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
import { RequisicionDeMaterialDet } from 'app/requisiciones/models';

@Component({
  selector: 'sx-requisicion-partidas',
  templateUrl: './requisicion-partidas.component.html',
  styleUrls: ['./requisicion-partidas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequisicionPartidasComponent extends LxTableComponent
  implements OnInit {
  @Output() selectionChange = new EventEmitter<
    Partial<RequisicionDeMaterialDet>[]
  >();

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
        const det: Partial<RequisicionDeMaterialDet> = rowNode.data;
        registros++;
      });
    }
    const res = [
      {
        producto: `Partidas: ${registros}`
      }
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Producto',
        field: 'producto',
        width: 115,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        pinned: 'left',
        width: 300
      },
      {
        headerName: 'Unidad',
        field: 'unidad',
        width: 90
      },
      {
        headerName: 'Solicitado',
        field: 'solicitado'
      },
      {
        headerName: 'Comentario',
        field: 'comentario'
      }
    ];
  }
}
