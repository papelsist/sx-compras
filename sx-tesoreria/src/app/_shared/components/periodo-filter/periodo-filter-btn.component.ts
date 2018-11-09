import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { PeriodoFilter } from 'app/models';
import { PeriodoFilterComponent } from './periodo-filter.component';

@Component({
  selector: 'sx-periodo-filter-btn',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class PeriodoFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: PeriodoFilter;
  @Output()
  change = new EventEmitter<PeriodoFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(PeriodoFilterComponent, {
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
