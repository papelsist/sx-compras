import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Store, select } from '@ngrx/store';

import * as fromStore from '../../store';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  FacturistaDeEmbarque,
  FacturistaPrestamo
} from 'app/control-de-embarques/model';

@Component({
  selector: 'sx-facturista-field',
  template: `
  <ng-container [formGroup]="parent" >
    <mat-form-field class="fill">
      <mat-select placeholder="Facturista" [formControlName]="propertyName" [compareWith]="compareWith">
        <mat-option *ngFor="let item of facturistas$ | async" [value]="item">
          {{item.nombre}}
        </mat-option>
      </mat-select>
    </mat-form-field>
  </ng-container>
  `,
  styles: [
    `
      .fill {
        width: 100%;
      }
    `
  ]
})
export class FacturistasFieldComponent implements OnInit {
  @Input()
  parent: FormGroup;

  @Input()
  propertyName = 'facturista';

  facturistas$: Observable<FacturistaDeEmbarque[]>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.facturistas$ = this.store.pipe(select(fromStore.getAllFacturistas));
  }

  compareWith(item1: FacturistaPrestamo, item2: FacturistaPrestamo) {
    if (item2) {
      return item1.id === item2.id;
    }
    return false;
  }
}
