import {
  Component,
  OnInit,
  Inject,
  Input,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { BehaviorSubject, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  filter,
  switchMap
} from 'rxjs/operators';

import { Producto } from 'app/productos/models/producto';
import { ProductosService } from 'app/productos/services';

@Component({
  selector: 'sx-alti-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alti-modal.component.html',
  styleUrls: ['./alti-modal.component.scss']
})
export class AltiModalComponent implements OnInit {
  search$ = new BehaviorSubject<string>('');
  productos: any[];
  rowSelection;
  selected: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<AltiModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rowSelection = data.selection || 'multiple';
    this.productos = data.productos || [];
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  select(event: any[]) {
    this.selected = event;
  }

  submit() {
    this.dialogRef.close(this.selected);
  }

  @HostListener('keydown.enter', ['$event'])
  onHotKeyInsert2(event) {
    this.submit();
  }
}
