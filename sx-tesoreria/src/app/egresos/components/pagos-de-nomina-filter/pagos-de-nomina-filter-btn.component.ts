import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PagosDeNominaFilter } from '../../models';
import { PagosDeNominaFilterComponent } from './pagos-de-nomina-filter.component';

@Component({
  selector: 'sx-pagos-de-nomina-filter-btn',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class PagosDeNominaFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: PagosDeNominaFilter;
  @Output()
  change = new EventEmitter<PagosDeNominaFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(PagosDeNominaFilterComponent, {
        data: { filter: this.filter }
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          this.change.emit(command);
        }
      });
  }
}
