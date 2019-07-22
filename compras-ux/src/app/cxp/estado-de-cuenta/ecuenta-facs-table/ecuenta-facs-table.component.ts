import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';

import { CuentaPorPagar } from 'app/cxp/model';
import { ColDef, ModelUpdatedEvent, RowSelectedEvent } from 'ag-grid-community';

@Component({
  selector: 'sx-ecuenta-facs-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ecuenta-facs-table.component.html',
  styleUrls: ['./ecuenta-facs-table.component.scss']
})
export class EcuentaFacsTableComponent extends LxTableComponent
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
    let totalMn = 0.0;
    let saldoMn = 0.0;
    let pagosMn = 0.0;
    let compensacionesMn = 0.0;
    let vencidoMn = 0.0;
    let porVencerMn = 0.0;
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const cxp: Partial<CuentaPorPagar> = rowNode.data;
        totalMn += cxp.totalMn;
        saldoMn += cxp.saldoMn;
        pagosMn += cxp.pagosMn;
        compensacionesMn += cxp.compensacionesMn;
        if (cxp.atraso > 0) {
          vencidoMn += cxp.saldoMn;
        }
        if (cxp.atraso <= 0) {
          porVencerMn += cxp.saldoMn;
        }
        registros++;
      });
    }
    const res = [
      {
        nombre: `Registros: ${registros}`,
        totalMn,
        saldoMn,
        pagosMn,
        compensacionesMn,
        vencidoMn
      }
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Nombre',
        field: 'nombre',
        width: 300,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Serie',
        field: 'serie',
        width: 100
      },
      {
        headerName: 'Factura',
        field: 'folio',
        width: 110
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 100,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Vto',
        field: 'vencimiento',
        width: 100,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        width: 70
      },
      {
        headerName: 'TC',
        field: 'tipoDeCambio',
        maxWidth: 60,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Total',
        field: 'totalMn',
        maxWidth: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Pagos',
        field: 'pagosMn',
        maxWidth: 100,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Notas',
        field: 'compensacionesMn',
        maxWidth: 100,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Saldo',
        field: 'saldoMn',
        maxWidth: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Atraso',
        field: 'atraso',
        maxWidth: 50
      },
      {
        headerName: 'Vencido',
        field: 'vencidoMn',
        maxWidth: 50,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Tipo',
        field: 'tipo'
      }
    ];
  }
}
