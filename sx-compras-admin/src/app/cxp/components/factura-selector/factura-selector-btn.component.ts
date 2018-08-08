import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialog } from '@angular/material';

import { CuentaPorPagar } from '../../model';
import { FacturaSelectorComponent } from '../factura-selector/factura-selector.component';

@Component({
  selector: 'sx-facturas-selector-btn',
  template: `
    <button mat-button type="button" (click)="openSelector()" [disabled]="isDisabled()">
      <mat-icon>file_upload</mat-icon> {{label}}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacturasSelectorBtnComponent implements OnInit {
  @Input() color = 'primary';
  @Input() label = 'Agregar facturas';
  @Input() facturas: CuentaPorPagar[];
  @Output() selected = new EventEmitter<CuentaPorPagar[]>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openSelector() {
    const ref = this.dialog.open(FacturaSelectorComponent, {
      data: { facturas: this.facturas },
      width: '750px'
    });
    ref.afterClosed().subscribe((selected: CuentaPorPagar[]) => {
      if (selected) {
        this.selected.emit(selected);
      }
    });
  }

  isDisabled() {
    return !this.facturas || this.facturas.length === 0;
  }
}
