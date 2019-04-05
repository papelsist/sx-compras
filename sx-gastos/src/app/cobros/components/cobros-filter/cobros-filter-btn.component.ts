import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CobrosFilterComponent } from './cobros-filter.component';
import { CobrosFilter } from '../../models';

@Component({
  selector: 'sx-cobros-filter-btn',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class CobrosFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: CobrosFilter;
  @Output()
  change = new EventEmitter<CobrosFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(CobrosFilterComponent, {
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
