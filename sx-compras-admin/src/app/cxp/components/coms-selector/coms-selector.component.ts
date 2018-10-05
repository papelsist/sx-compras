import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';

@Component({
  selector: 'sx-coms-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coms-selector.component.html',
  styles: [
    `
      .coms-table-panel {
        max-height: 500px;
        overflow: auto;
      }
    `
  ]
})
export class ComsSelectorComponent implements OnInit {
  coms: any[];
  title: string;
  selected: CuentaPorPagar[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.coms = data.coms;
    this.title = data.title || 'Selector de COMs';
    this.selected = data.selected || undefined;
  }

  ngOnInit() {}

  onSelection(event: CuentaPorPagar[]) {
    this.selected = event;
  }
}
