import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../../reportes/services/report.service';

import { TdDialogService } from '@covalent/core';

import { NotaDeCreditoCxP } from '../../model';

@Component({
  selector: 'sx-nota-print',
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
export class NotaPrintComponent implements OnInit {
  @Input() color = 'default';
  @Input() title = 'Imprimir';
  @Input() smallIcon = false;
  @Input() nota: NotaDeCreditoCxP;
  @Input() params: any;
  constructor(
    private service: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {}

  runReport(event: Event) {
    event.preventDefault();
    if (this.nota.moneda !== 'MXN') {
      this.confirmarMoneda();
    } else {
      this.imprimir();
    }
  }

  private confirmarMoneda() {
    this.dialogService
      .openConfirm({
        title: `Requisición ${this.nota.folio}`,
        message: `Imprimir en ${this.nota.moneda}`,
        acceptButton: 'Si',
        cancelButton: 'No'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.imprimir(this.nota.moneda);
        } else {
          this.imprimir();
        }
      });
  }

  private imprimir(moneda: string = 'MXN') {
    const params = { moneda };
    const url = `cxp/notas/print/${this.nota.id}`;
    this.service.runReport(url, params);
  }
}
