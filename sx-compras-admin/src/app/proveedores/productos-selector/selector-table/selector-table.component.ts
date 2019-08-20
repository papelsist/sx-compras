import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { ColDef, ModelUpdatedEvent, RowSelectedEvent } from 'ag-grid-community';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';

@Component({
  selector: 'sx-selector-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selector-table.component.html',
  styleUrls: ['./selector-table.component.scss']
})
export class SelectorTableComponent extends LxTableComponent implements OnInit {
  @Output() selectionChange = new EventEmitter<any[]>();

  constructor(public tableService: SxTableService) {
    super(tableService);
    // this.debug = true;
  }

  buildGridOptions() {
    super.buildGridOptions();
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.onRowSelected = (event: RowSelectedEvent) => {
      this.selectionChange.emit(this.gridApi.getSelectedRows());
      this.actualizarTotales();
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
    if (this.gridApi) {
      const res = [
        {
          clave: `Selec:`,
          descripcion: `Seleccionados: ${this.gridApi.getSelectedRows().length}`
        }
      ];
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  filter(term: string) {
    this.gridApi.setQuickFilter(term);
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Producto',
        field: 'clave',
        width: 115,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 350,
        pinned: 'left'
      },
      {
        headerName: 'U',
        field: 'unidad',
        width: 50
      },
      {
        headerName: 'Línea',
        field: 'linea'
      },
      {
        headerName: 'Marca',
        field: 'marca'
      }
    ];
  }
}
