import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { Subscription } from 'rxjs';

import { FacturaSelectorComponent } from '../factura-selector/factura-selector.component';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';

@Component({
  selector: 'sx-analisis-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analisis-form.component.html'
})
export class AnalisisFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subsrciptions: Subscription[] = [];
  @Input() facturas: CuentaPorPagar[];
  @Output() proveedorSelected = new EventEmitter();
  @Output() cancelar = new EventEmitter();
  @Output() save = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

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
      factura: [null, Validators.required],
      importeFlete: [null],
      comentario: [null]
    });
  }

  seleccionarFactura() {
    const dialogRef = this.dialog.open(FacturaSelectorComponent, {
      data: {
        title: 'Facturas pendientes de analizar',
        facturas: this.facturas
      },
      width: '850px'
    });
    dialogRef.afterClosed().subscribe((facturas: CuentaPorPagar[]) => {
      if (facturas.length > 0) {
        this.form.get('factura').setValue(facturas[0]);
        this.cd.detectChanges();
      }
    });
  }

  get proveedor() {
    return this.form.get('proveedor').value;
  }

  get factura(): CuentaPorPagar {
    return this.form.get('factura').value;
  }

  onSubmit() {
    if (this.form.valid) {
      const fecha: Date = this.form.value.fecha;

      const analisis = {
        ...this.form.value,
        fecha: fecha.toISOString(),
        importeFlete: this.form.value.importeFlete || 0.0
      };
      console.log('Salvando: ', analisis);
      this.save.emit(analisis);
    }
  }
}
