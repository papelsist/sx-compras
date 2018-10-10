import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../../reportes/services/report.service';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-print-cheque',
  template: `
    <button mat-button [color]="color" (click)="runReport()" >
      Imprimir cheque
    </button>
  `
})
export class PrintChequeComponent implements OnInit {
  @Input()
  color = 'default';
  @Input()
  title = 'Imprimir';
  @Input()
  smallIcon = false;

  @Input()
  egreso: any;

  constructor(
    private service: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {}

  runReport() {
    this.confirmar();
  }

  private confirmar() {
    this.dialogService
      .openConfirm({
        title: 'Impresión de Cheque',
        message: 'Folio: ' + this.egreso.cheque.folio,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        const url = `tesoreria/cheques/print/${this.egreso.cheque.id}`;
        this.service.runReport(url, {});
      });
  }
}
