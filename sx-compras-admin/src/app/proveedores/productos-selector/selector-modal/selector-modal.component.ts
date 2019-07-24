import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  filter,
  switchMap
} from 'rxjs/operators';

@Component({
  selector: 'sx-selector-modal',
  templateUrl: './selector-modal.component.html',
  styleUrls: ['./selector-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorModalComponent implements OnInit {
  productos: any[];
  selected: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<SelectorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productos = data.productos;
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  onSelection(event: any[]) {
    this.selected = event;
  }

  doSubmit() {
    if (this.selected.length > 0) {
      this.dialogRef.close(this.selected);
    }
  }
}
