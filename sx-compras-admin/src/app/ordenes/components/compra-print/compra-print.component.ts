import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../../reportes/services/report.service';
import { Compra } from '../../models/compra';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-compra-print',
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
export class CompraPrintComponent implements OnInit {
  @Input() color = 'default';
  @Input() title = 'Imprimir';
  @Input() smallIcon = false;
  @Input() compra: Compra;
  @Input() params: any;
  constructor(
    private service: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {}

  runReport(event: Event) {
    event.preventDefault();
    this.confirmarClaves();
  }

  private confirmarClaves() {
    this.dialogService
      .openConfirm({
        title: `Compra ${this.compra.folio}`,
        message: `Claves del proveedor`,
        acceptButton: 'Si',
        cancelButton: 'No'
      })
      .afterClosed()
      .subscribe(res => {
        this.imprimir(res);
      });
  }

  private imprimir(clavesProveedor: boolean) {
    const params = { clavesProveedor };
    const url = `compras/print/${this.compra.id}`;
    this.service.runReport(url, params);
  }
}
