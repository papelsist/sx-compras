import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../store';
import * as fromStore from '../store';
import { Observable, of } from 'rxjs';
import { AltiModalComponent } from '../components';
import { ProductosService } from './productos/productos.service';
import { map, tap, take, switchMap, finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductoUtilsService {
  constructor(private dialog: MatDialog, private service: ProductosService) {}

  productos: any[];

  consultaRapida() {
    /*
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
      */
  }

  seleccionar(multiple = true, widh = '550px') {
    return this.service.lookup(true, 'TODAS').pipe(
      map(res => this.showSelector(res)),
      finalize(() => console.log('Done: '))
    );
  }

  showSelector(rows: any[], multiple = true, width = '850px') {
    return this.dialog.open(AltiModalComponent, {
      data: { multiple, productos: rows },
      width
    });
  }

  loadProductos() {
    return this.service.lookup();
  }
}
