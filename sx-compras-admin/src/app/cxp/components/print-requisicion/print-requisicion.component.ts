import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../../reportes/services/report.service';

import { TdDialogService } from '@covalent/core';

import { Requisicion } from '../../model';

@Component({
  selector: 'sx-print-requisicion',
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
export class PrintRequisicionComponent implements OnInit {
  @Input() color = 'default';
  @Input() title = 'Imprimir';
  @Input() smallIcon = false;
  @Input() requisicion: Requisicion;
  @Input() params: any;
  constructor(
    private service: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {}

  runReport(event: Event) {
    event.preventDefault();
    if (this.requisicion.moneda !== 'MXN') {
      this.confirmarMoneda();
    } else {
      this.imprimir();
    }
  }

  private confirmarMoneda() {
    this.dialogService
      .openConfirm({
        title: `Requisición ${this.requisicion.folio}`,
        message: `Imprimir en ${this.requisicion.moneda}`,
        acceptButton: 'Si',
        cancelButton: 'No'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.imprimir(this.requisicion.moneda);
        } else {
          this.imprimir();
        }
      });
  }

  private imprimir(moneda: string = 'MXN') {
    const params = { moneda };
    const url = `requisicionesDeCompras/print/${this.requisicion.id}`;
    this.service.runReport(url, params);
  }
}
