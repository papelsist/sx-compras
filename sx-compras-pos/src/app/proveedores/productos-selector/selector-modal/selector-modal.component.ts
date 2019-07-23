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

  constructor(
    public dialogRef: MatDialogRef<AltpModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productos = data.productos;
  }

  ngOnInit() {}

  onSearch(event) {}

  close() {
    this.dialogRef.close();
  }

  select(event: any[]) {
    this.dialogRef.close(event);
  }
}
