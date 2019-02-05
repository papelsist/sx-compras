import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CfdisFilter } from '../../models';
import { CfdisFilterComponent } from './cfdis-filter.component';

@Component({
  selector: 'sx-cfdis-filter-btn',
  template: `
    <button mat-button mat-icon-button (click)="openFilter()">
      <mat-icon [color]="color">filter_list</mat-icon>
    </button>
  `
})
export class CfdisFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: CfdisFilter;
  @Output()
  change = new EventEmitter<CfdisFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(CfdisFilterComponent, {
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
