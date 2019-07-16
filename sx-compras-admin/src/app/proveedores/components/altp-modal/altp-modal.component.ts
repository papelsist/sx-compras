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

import { ProveedoresService } from 'app/proveedores/services';
import { Proveedor } from 'app/proveedores/models/proveedor';

@Component({
  selector: 'sx-altp-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './altp-modal.component.html',
  styleUrls: ['./altp-modal.component.scss']
})
export class AltpModalComponent implements OnInit {
  search$ = new BehaviorSubject<string>('');
  proveedores$: Observable<Proveedor[]>;
  constructor(
    private service: ProveedoresService,
    public dialogRef: MatDialogRef<AltpModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    const source$ = this.search$.pipe(
      debounceTime(500),
      filter((val: string) => val.length > 2),
      distinctUntilChanged()
    );
    this.proveedores$ = source$.pipe(
      switchMap(term => this.service.lookupProveedores(term))
    );
    // source$.subscribe(data => console.log('Data: ', data));
  }

  onSearch(event) {
    this.search$.next(event);
  }

  close() {
    this.dialogRef.close();
  }

  select(event: Proveedor) {
    this.dialogRef.close(event);
  }
}
