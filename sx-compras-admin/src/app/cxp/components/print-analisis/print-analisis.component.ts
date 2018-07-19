import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../../reportes/services/report.service';
import { Analisis } from '../../model';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-print-analisis',
  template: `
    <mat-icon class="cursor-pointer"
      [color]="color" (click)="runReport($event)"  *ngIf="smallIcon">
      print
    </mat-icon>

    <button mat-button [color]="color" (click)="runReport($event)" *ngIf="!smallIcon">
      <mat-icon>print</mat-icon> {{title}}
    </button>
  `
})
export class PrintAnalisisComponent implements OnInit {
  @Input() color = 'default';
  @Input() title = 'Imprimir';
  @Input() smallIcon = false;
  @Input() analisis: Analisis;
  @Input() params: any;
  constructor(
    private service: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {}

  runReport(event: Event) {
    event.preventDefault();
    if (this.analisis.factura.moneda !== 'MXN') {
      this.confirmarMoneda();
    } else {
      this.imprimir();
    }
  }

  private confirmarMoneda() {
    this.dialogService
      .openConfirm({
        title: `Analisis ${this.analisis.folio}`,
        message: `Imprimir en ${this.analisis.factura.moneda}`,
        acceptButton: 'Si',
        cancelButton: 'No'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.imprimir(this.analisis.factura.moneda);
        } else {
          this.imprimir();
        }
      });
  }

  private imprimir(moneda: string = 'MXN') {
    const params = { moneda };
    const url = `analisisDeFactura/print/${this.analisis.id}`;
    this.service.runReport(url, params);
  }
}
