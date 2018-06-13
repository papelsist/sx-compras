import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { Subscription } from 'rxjs';

import { FacturaSelectorComponent } from '../factura-selector/factura-selector.component';

@Component({
  selector: 'sx-analisis-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analisis-form.component.html'
})
export class AnalisisFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subsrciptions: Subscription[] = [];
  @Output() proveedorSelected = new EventEmitter();
  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit() {
    this.buildForm();
    this.subsrciptions.push(
      this.form.get('proveedor').valueChanges.subscribe(proveedor => {
        this.proveedorSelected.emit(proveedor);
      })
    );
  }

  ngOnDestroy() {
    this.subsrciptions.forEach(subs => subs.unsubscribe());
  }

  private buildForm() {
    this.form = this.fb.group({
      proveedor: [null, Validators.required],
      fecha: [new Date(), Validators.required],
      factura: [null],
      comentario: [null]
    });
  }

  seleccionarFactura() {
    const dialogRef = this.dialog.open(FacturaSelectorComponent, {
      data: { title: 'Facturas pendientes de analizar' },
      width: '750px'
    });
    dialogRef.afterClosed().subscribe(factura => {
      console.log('Factura seleccionada: ', factura);
    });
  }

  get proveedor() {
    return this.form.get('proveedor').value;
  }
}
