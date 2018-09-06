import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';

import { RecepcionDeCompra } from '../../models/recepcionDeCompra';
import {
  RecepcionDeCompraDet,
  buildRecepcionDet
} from '../../models/recepcionDeCompraDet';
import { MatDialog } from '@angular/material';
import { ComprasSelectorComponent } from '../compras-selector/compras-selector.component';
import { ComPartidasComponent } from '../com-partidas/com-partidas.component';

@Component({
  selector: 'sx-com-create-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './com-create-form.component.html'
})
export class ComCreateFormComponent implements OnInit {
  @Output() save = new EventEmitter<Partial<RecepcionDeCompra>>();

  @ViewChild(ComPartidasComponent) partidasTable: ComPartidasComponent;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private clarPartidas() {
    while (this.partidas.length !== 0) {
      this.partidas.removeAt(0);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      fechaRemision: [{ value: null, disabled: false }, [Validators.required]],
      proveedor: [null, [Validators.required]],
      compra: [null, [Validators.required]],
      comentario: [],
      remision: [null],
      remisionFecha: [null],
      partidas: this.fb.array([])
    });
  }

  onSave() {
    if (this.form.valid) {
      const fechaRemision = this.form.get('fechaRemision').value.toISOString();
      const partidas = [...this.partidas.value];
      const compra = this.form.get('compra').value.id;
      const res = {
        ...this.form.value,
        fechaRemision,
        partidas,
        compra
      };
      this.save.emit(res);
    }
  }

  seleccionarCompra() {
    this.dialog
      .open(ComprasSelectorComponent, {
        data: { title: 'Compras pendientes', proveedor: this.proveedor }
      })
      .afterClosed()
      .subscribe(selected => {
        if (selected) {
          const compra = selected[0];
          console.log('Compra asignada: ', compra);
          this.form.get('compra').setValue(compra);
          compra.partidas.forEach(element => {
            const det = buildRecepcionDet(element);
            this.partidas.push(new FormControl(det));
          });
          this.cd.detectChanges();
        }
      });
  }

  onEditPartida(index: number, cantidad: number) {
    const control = this.partidas.at(index);
    const det: RecepcionDeCompraDet = control.value;
    det.cantidad = cantidad;
    this.partidas.setControl(index, new FormControl(det));
    this.form.markAsDirty();
  }

  onInsertPartida(event: RecepcionDeCompraDet) {
    this.partidas.push(new FormControl(event));
    this.form.markAsDirty();
  }

  onDeletePartida(index: number) {
    this.partidas.removeAt(index);
    this.form.markAsDirty();
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }

  get proveedor() {
    return this.form.get('proveedor').value;
  }
}
