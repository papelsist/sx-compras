import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { RembolsosFilter } from '../../models';
import { RembolsosFilterComponent } from './rembolsos-filter.component';

@Component({
  selector: 'sx-rembolsos-filter-btn',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class RembolsosFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: RembolsosFilter;
  @Output()
  change = new EventEmitter<RembolsosFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(RembolsosFilterComponent, {
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
