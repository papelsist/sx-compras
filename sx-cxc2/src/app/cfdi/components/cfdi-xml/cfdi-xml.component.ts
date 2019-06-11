import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { CfdiService } from 'app/cfdi/services/cfdi.service';

@Component({
  selector: 'sx-cfdi-xml',
  template: `
    <button mat-button type="button" (click)="mostrarXml(cfdi)" *ngIf="cfdi">
      <mat-icon>settings_ethernet</mat-icon> {{ label }}
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CfdiXmlComponent implements OnInit {
  @Input() cfdi: any;
  @Input() label = 'CFDI XML';
  @Input() target: string;

  constructor(private service: CfdiService) {}

  ngOnInit() {}

  mostrarXml() {
    this.service.mostrarXml(this.cfdi.id);
  }
}
