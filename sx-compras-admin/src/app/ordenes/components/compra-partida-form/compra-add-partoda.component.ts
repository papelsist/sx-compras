import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatDialog } from '@angular/material';

import { ProveedorProducto } from 'app/proveedores/models/proveedorProducto';
import { CompraPartidaFormComponent } from './compra-partida-form.component';
import { CompraDet, buildCompraDet } from '../../models/compraDet';

@Component({
  selector: 'sx-compra-add-partida',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button type="button"  (click)="buildPartida()" [disabled]="parent.disabled || productos.length === 0">
      <mat-icon>add</mat-icon>
    </button>
  `
})
export class CompraAddPartidaComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() productos: ProveedorProducto[];
  @Output() addPartida = new EventEmitter<Partial<CompraDet>>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  buildPartida() {
    this.dialog
      .open(CompraPartidaFormComponent, {
        data: { proveedor: this.proveedor, productos: this.productos },
        width: '600px'
      })
      .afterClosed()
      .subscribe(det => {
        if (det) {
          const compraDet: Partial<CompraDet> = buildCompraDet(det.producto);
          const { solicitado, comentario } = det;
          const partida = {
            ...compraDet,
            solicitado,
            comentario
          };
          this.addPartida.emit(partida);
        }
      });
  }

  get proveedor() {
    return this.parent.get('proveedor').value;
  }
}
