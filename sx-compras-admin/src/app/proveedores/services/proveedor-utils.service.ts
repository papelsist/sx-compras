import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AltpModalComponent } from '../components';

import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../store';
import * as fromStore from '../store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProveedorUtilsService {
  constructor(
    private store: Store<fromStore.ProveedoresState>,
    private dialog: MatDialog
  ) {}

  consultaRapida() {
    this.dialog
      .open(AltpModalComponent, {
        data: {},
        minWidth: '550px'
      })
      .afterClosed()
      .subscribe(prov => {
        if (prov) {
          this.store.dispatch(
            new fromRoot.Go({ path: ['proveedores', prov.id] })
          );
        }
      });
  }

  seleccionar(multiple = false, widh = '550px'): Observable<any> {
    return this.dialog
      .open(AltpModalComponent, {
        data: { multiple },
        minWidth: '550px'
      })
      .afterClosed();
  }
}
