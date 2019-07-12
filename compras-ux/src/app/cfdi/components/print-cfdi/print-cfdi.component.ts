import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { ReportService } from 'app/reportes/services/report.service';

@Component({
  selector: 'sx-print-cfdi',
  template: `
    <button mat-button type="button" (click)="print(cfdi)">
      <mat-icon>print</mat-icon> {{ label }}
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintCfdiComponent implements OnInit {
  @Input() cfdi: any;
  @Input() label = 'IMPRIMIR';

  constructor(private service: ReportService) {}

  ngOnInit() {}

  print(cfdi: any) {
    this.service.runReport(`cfdi/print/${cfdi.id}`, {});
  }
}
