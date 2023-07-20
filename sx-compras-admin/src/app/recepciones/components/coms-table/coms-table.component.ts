import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';

import { ColDef, ModelUpdatedEvent, RowSelectedEvent } from 'ag-grid-community';

import { RecepcionDeCompra } from '../../models/recepcionDeCompra';

@Component({
  selector: 'sx-coms-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  `
})
export class ComsTableComponent extends LxTableComponent implements OnInit {
  @Output() selectionChange = new EventEmitter<any[]>();
  @Input() selection: any[] = [];

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
        const row: Partial<RecepcionDeCompra> = rowNode.data;
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

  getPrintUrl(event: RecepcionDeCompra) {
    return `coms/print/${event.id}`;
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Sucursal',
        field: 'sucursalNombre',
        width: 115,
        pinned: 'left'
      },
      {
        headerName: 'COM',
        field: 'documento',
        width: 100,
        pinned: 'left'
      },
      {
        headerName: 'Proveedor',
        field: 'nombre',
        width: 300,
        pinned: 'left'
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 100,
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Compra',
        field: 'compraFolio'
      },
      {
        headerName: 'Remisión',
        field: 'remision'
      },
      {
        headerName: 'F.Remisión',
        field: 'fechaRemision',
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Comentario',
        field: 'comentario'
      },
      {
        headerName: 'Actualizó',
        field: 'updateUser',
        width: 120
      },
      {
        headerName: 'Modificado',
        field: 'dateCreated',
        valueFormatter: params =>
          this.transformDate(params.value, 'dd/MM/yyyy HH:mm')
      }
    ];
  }
}
