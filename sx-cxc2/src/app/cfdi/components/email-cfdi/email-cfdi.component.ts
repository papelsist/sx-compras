import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { CfdiService } from 'app/cfdi/services/cfdi.service';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-email-cfdi',
  template: `
    <button mat-button type="button" (click)="email(cfdi)" *ngIf="cfdi">
      <mat-icon>email</mat-icon> {{ label }}
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailCfdiComponent implements OnInit {
  @Input() cfdi: any;
  @Input() label = 'E-MAIL';
  @Input() target: string;

  constructor(
    private service: CfdiService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {}

  email() {
    this.dialogService
      .openPrompt({
        title: 'COMPROBANTE FISCAL DIGITAL (CFDI)',
        message: 'ENVIAR POR CORREO ELECTRÓNICO A: ',
        value: this.target,
        acceptButton: 'ENVIAR',
        cancelButton: 'CANCELAR',
        minWidth: '600px'
      })
      .afterClosed()
      .subscribe(email => {
        if (email) {
          this.service.email(this.cfdi.id, email).subscribe( res => console.log('email res:', res));
        }
      });
  }
}
