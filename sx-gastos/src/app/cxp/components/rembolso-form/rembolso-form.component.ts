import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from '@angular/forms';

import {
  Rembolso,
  RembolsoDet,
  buildRembolsoDet,
  CuentaPorPagar
} from '../../model';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { RembolsoDetComponent } from './rembolso-det.component';

@Component({
  selector: 'sx-rembolso-form',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rembolso-form.component.html'
})
export class RembolsoFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  rembolso: Rembolso;

  @Output()
  save = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  @Output()
  cerrar = new EventEmitter();

  destroy$ = new Subject();

  form: FormGroup;
  /*
  conceptos = [
    'REMBOLSO',
    'PAGO_TARJETA',
    'PAGO_CONTABLE',
    'PRESTAMO_CHOFER',
    'PRESTAMO_EMPLEADO',
    'CARGA_SOCIAL',
    'PAGO_CHOFER',
    'CUOTA_SINDICAL'
  ];
  */
  conceptos = [
    'REMBOLSO',
    'PAGO',
    'GASTO',
    'PRESTAMO',
    'DEVOLUCION',
    'ESPECIAL',
    'ESPECIALM'
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.buildForm();
    this.conceptoListener();
    this.form.patchValue({ concepto: 'REMBOLSO' });
    if (changes.rembolso && changes.rembolso.currentValue) {
      this.setReembolso();
    }
  }

  ngOnDestroy() {
    this.destroy$.next('end');
    this.destroy$.complete();
  }

  setReembolso() {
    this.form.patchValue(this.rembolso);
    this.cleanPartidas();
    this.rembolso.partidas.forEach(det => {
      this.partidas.push(new FormControl(det));
    });
    if (this.rembolso.egreso) {
      // this.form.disable();
    }
  }

  private buildForm() {
    if (!this.form) {
      this.form = this.fb.group({
        sucursal: [null, [Validators.required]],
        proveedor: [null],
        nombre: [null],
        concepto: [null, [Validators.required]],
        fecha: [new Date(), [Validators.required]],
        fechaDePago: [new Date(), [Validators.required]],
        formaDePago: [
          { value: 'CHEQUE', disable: true },
          [Validators.required]
        ],
        moneda: [{ value: 'MXN', disabled: true }, [Validators.required]],
        tipoDeCambio: [
          { value: 1.0, disabled: true },
          [Validators.required, Validators.min(1)]
        ],
        total: [
          { value: 0.0, disabled: true },
          [Validators.required, Validators.min(1)]
        ],
        apagar: [0.0, Validators.required],
        comentario: [],
        cuentaContable: [null],
        partidas: this.fb.array([])
      });
    }
  }

  conceptoListener() {
    this.form
      .get('concepto')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        if (val === 'REMBOLSO') {
          this.form.get('proveedor').disable();
          this.form.get('nombre').disable();
        } else {
          this.form.get('proveedor').enable();
          this.form.get('nombre').enable();
        }
      });
  }

  private cleanPartidas() {
    while (this.partidas.length !== 0) {
      this.partidas.removeAt(0);
    }
  }

  onSubmit() {
    if (this.form.valid && !this.form.disabled) {
      this.form.markAsPristine();
      const sucursal: any = this.form.value.sucursal;
      let fecha = this.form.value.fecha;
      if (fecha instanceof Date) {
        fecha = fecha.toISOString();
      }
      let fechaDePago = this.form.value.fechaDePago;
      if (fechaDePago instanceof Date) {
        fechaDePago = fechaDePago.toISOString();
      }
      const total = this.total;
      const entity = {
        ...this.form.value,
        id: this.rembolso ? this.rembolso.id : null,
        sucursal: { id: sucursal.id },
        fecha,
        fechaDePago,
        total,
        apagar: total
      };
      if(this.form.get('cuentaContable').value) {
        entity.cuentaContable = this.form.get('cuentaContable').value.id
      }
      this.save.emit(entity);
    }
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }

  onAgregarFactura(selected: CuentaPorPagar[]) {
    // console.log('Agregando: ', selected);
    selected.forEach(cxp => {
      const det = buildRembolsoDet(cxp);
      const parts: RembolsoDet[] = this.partidas.value;
      const found = parts.find(item => {
        if (item.cxp) {
          return item.cxp.id === cxp.id;
        } else {
          return false;
        }
      });
      if (!found) {
        this.partidas.push(new FormControl(det));
      }
    });
    this.form.markAsDirty();
  }

  addNoDeducible() {
    this.dialog
      .open(RembolsoDetComponent, { data: {} })
      .afterClosed()
      .subscribe(partida => {
        if (partida) {
          partida.apagar = partida.total;
          this.partidas.push(new FormControl(partida));
          this.form.markAsDirty();
        }
      });
  }
  onEditRow(index: number) {
    const control = this.partidas.at(index);
    const det: RembolsoDet = control.value;
    this.dialog
      .open(RembolsoDetComponent, { data: { partida: det } })
      .afterClosed()
      .subscribe(partida => {
        if (partida) {
          const res = { ...det, ...partida };
          control.setValue(res);
          this.form.markAsDirty();
        }
      });
  }

  onDeleteRow(index: number) {
    this.partidas.removeAt(index);
    this.form.markAsDirty();
  }
  onUpdateRow(event) {
    this.form.markAsDirty();
  }

  get total() {
    return _.sumBy(this.partidas.value, 'total');
  }
}
