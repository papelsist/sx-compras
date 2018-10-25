import { Component, OnInit, Input } from '@angular/core';

import { ReportService } from '../../../reportes/services/report.service';
import { Rembolso } from '../../models';

@Component({
  selector: 'sx-print-rembolso',
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
export class PrintRembolsoComponent implements OnInit {
  @Input()
  color = 'default';
  @Input()
  title = 'Imprimir';
  @Input()
  smallIcon = false;
  @Input()
  rembolso: Rembolso;
  @Input()
  params: any;
  constructor(private service: ReportService) {}

  ngOnInit() {}

  runReport(event: Event) {
    event.preventDefault();
    const url = `rembolsos/print/${this.rembolso.id}`;
    this.service.runReport(url);
  }
}
