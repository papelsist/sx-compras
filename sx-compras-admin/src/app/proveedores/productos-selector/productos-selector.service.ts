import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SelectorModalComponent } from './selector-modal/selector-modal.component';
import { ProveedorProductoService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class ProductosSelectorService {
  constructor(
    private dialog: MatDialog,
    private service: ProveedorProductoService
  ) {}

  opneSelection(productos: any[]) {
    return this.dialog.open(SelectorModalComponent, { data: { productos } });
  }
}
