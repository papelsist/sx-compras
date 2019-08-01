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

import { ColDef, ModelUpdatedEvent, RowSelectedEvent } from 'ag-grid-community';
import { ListaDePreciosVentaDet } from 'app/precios/models';

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
        headerName: 'Producto',
        field: 'clave',
        width: 110,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 300,
        pinned: 'left'
      },
      {
        headerName: 'Linea',
        field: 'linea',
        width: 130
      },
      {
        headerName: 'Costo',
        field: 'costo',
      },
      {
        headerName: 'Costo U',
        field: 'costoUltimo',
      },
      {
        headerName: 'Precio (CON)',
        field: 'precioContado',
      },
      {
        headerName: 'P. A. (CON)',
        field: 'precioAnteriorContado',
      },
      {
        headerName: 'Precio (CRE)',
        field: 'precioCredito',
      },
      {
        headerName: 'P. A. (CRE)',
        field: 'precioAnteriorCredito',
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
    ];
  }
}
