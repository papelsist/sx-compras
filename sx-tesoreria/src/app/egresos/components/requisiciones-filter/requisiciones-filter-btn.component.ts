import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RequisicionesFilterComponent } from './requisiciones-filter.component';
import { RequisicionesFilter } from '../../models';

@Component({
  selector: 'sx-requisiciones-filter-btn',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class RequisicionesFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: RequisicionesFilter;
  @Output()
  change = new EventEmitter<RequisicionesFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(RequisicionesFilterComponent, {
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
