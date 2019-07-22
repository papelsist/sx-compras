import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';

import { CuentaPorPagar } from 'app/cxp/model';
import { ColDef, ModelUpdatedEvent, RowSelectedEvent } from 'ag-grid-community';

@Component({
  selector: 'sx-ecuenta-table',
  templateUrl: './ecuenta-table.component.html',
  styleUrls: ['./ecuenta-table.component.scss']
})
export class EcuentaTableComponent extends LxTableComponent implements OnInit {
  @Output() selectionChange = new EventEmitter<any[]>();
  _saldoInicial = 0.0;

  constructor(public tableService: SxTableService) {
    super(tableService);
  }

  buildGridOptions() {
    super.buildGridOptions();
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      sortable: false,
      resizable: true
    };
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
    let acumulado = 0;

    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const row = rowNode.data;
        acumulado += row.importe;
        registros++;
      });
    }
    const saldo = this._saldoInicial + acumulado;
    const res = [
      {
        tipo: `Movimientos: ${registros}`,
        moneda: `Saldo Final:`,
        saldo
      }
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  actualizarIniciales() {
    if (this.gridApi) {
      const res = [{ moneda: `Saldo Inicial:`, saldo: this._saldoInicial }];
      this.gridApi.setPinnedTopRowData(res);
    }
  }

  @Input()
  set saldoInicial(saldo: number) {
    this._saldoInicial = saldo;
    this.actualizarIniciales();
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Serie',
        field: 'serie',
        width: 100,
        pinned: 'left'
      },
      {
        headerName: 'Folio',
        field: 'folio',
        width: 100,
        pinned: 'left'
      },
      {
        headerName: 'Tipo',
        field: 'tipo'
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        width: 150
      },
      {
        headerName: 'TC',
        field: 'tipoDeCambio',
        width: 100,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Importe',
        field: 'importe',
        maxWidth: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Saldo',
        field: 'saldo',
        maxWidth: 110,
        cellRenderer: params => this.transformCurrency(params.value)
        // pinnedRowCellRenderer: params => {
        //   console.log(params);
        //   if (params.value) {
        //     const r = this.transformCurrency(params.value);
        //     const l =
        //       params.rowNode.rowPinned === 'top'
        //         ? 'Saldo Inicial:'
        //         : 'Saldo Final';
        //     return `${l} ${r}`;
        //   } else {
        //     return '';
        //   }
        // }
      },
      {
        headerName: 'Comentario',
        field: 'comentario'
      }
    ];
  }
}
