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
import { ComprobanteFiscalConcepto } from 'app/cxp/model';

@Component({
  selector: 'sx-cfdi-conceptos-table2',
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
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdate($event)"
      >
      </ag-grid-angular>
    </div>
  `
})
export class CfdiConceptosTable2Component extends LxTableComponent
  implements OnInit {
  @Output()
  selectionChange = new EventEmitter<any[]>();

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
    }
  }

  actualizarTotales() {
    let registros = 0;
    let importe = 0;
    this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
      const con: Partial<ComprobanteFiscalConcepto> = rowNode.data;
      registros++;
      importe += con.importe;
    });
    const res = [
      {
        descripcion: `Registros: ${registros}`,
        importe
      }
    ];
    this.gridApi.setPinnedBottomRowData(res);
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Clave',
        field: 'claveProdServ',
        width: 125,
        pinned: 'left'
      },
      {
        headerName: 'Descripcion',
        field: 'descripcion',
        width: 350,
        pinned: 'left'
      },
      {
        headerName: 'U',
        field: 'claveUnidad',
        width: 90
      },
      {
        headerName: 'Cant',
        field: 'cantidad',
        width: 100
      },
      {
        headerName: 'V. Unitario',
        field: 'valorUnitario',
        width: 100,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Importe',
        field: 'importe',
        width: 120,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Descto',
        field: 'descuento',
        width: 100,
        cellRenderer: params => this.transformCurrency(params.value)
      }
    ];
  }
}
