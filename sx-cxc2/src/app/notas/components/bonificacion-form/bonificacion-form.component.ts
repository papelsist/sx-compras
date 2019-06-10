import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControlOptions
} from '@angular/forms';
import {
  Bonificacion,
  CuentaPorCobrar,
  NotaDeCreditoDet,
  buildNotaDet
} from 'app/cobranza/models';

import { Subject, combineLatest, merge, concat } from 'rxjs';
import { takeUntil, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-bonificacion-form',
  templateUrl: './bonificacion-form.component.html',
  styleUrls: ['./bonificacion-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BonificacionFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() bonificacion: Bonificacion;

  form: FormGroup;

  @Output() save = new EventEmitter();

  @Output() cancel = new EventEmitter();

  destroy$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.registerTipoListener();
    this.setBonificacion();
    this.eventBus();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bonificacion && changes.bonificacion.currentValue) {
      if (!changes.bonificacion.firstChange) {
        const b: Bonificacion = changes.bonificacion.currentValue;
        console.log('After success save: ', b);
        /*
        this.cleanPartidas();
        b.partidas.forEach(det => {
          this.partidas.push(new FormControl(det));
        });
        */
      } else {
        console.log('Editando: ', changes.bonificacion.currentValue);
      }
    }
  }

  private setBonificacion() {
    this.cleanPartidas();
    this.form.patchValue(this.bonificacion);
    this.bonificacion.partidas.forEach(det => {
      this.partidas.push(new FormControl(det));
    });
  }

  private cleanPartidas() {
    while (this.partidas.length !== 0) {
      this.partidas.removeAt(0);
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      tipoDeCalculo: [null, [Validators.required]],
      baseDelCalculo: [null],
      descuento: [
        0.0,
        {
          validators: [Validators.min(0.1), Validators.max(70)]
          // updateOn: 'blur'
        }
      ],
      descuento2: [0.0],
      importe: [0.0],
      comentario: [],
      partidas: this.fb.array([])
    });
  }

  private registerTipoListener() {
    this.form
      .get('tipoDeCalculo')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value === 'PRORRATEO') {
          this.form.get('importe').enable({ emitEvent: false });
          this.form.get('descuento').setValue(0.0, { emitEvent: false });
          this.form.get('descuento').disable({ emitEvent: false });
        } else {
          this.form.get('importe').disable({ emitEvent: false });
          this.form.get('importe').setValue(0.0, { emitEvent: false });
          this.form.get('descuento').enable({ emitEvent: false });
        }
      });
  }

  private eventBus() {
    const tipo$ = this.form
      .get('tipoDeCalculo')
      .valueChanges.pipe(takeUntil(this.destroy$));
    const base$ = this.form
      .get('baseDelCalculo')
      .valueChanges.pipe(takeUntil(this.destroy$));
    const descuento$ = this.form
      .get('descuento')
      .valueChanges.pipe(takeUntil(this.destroy$));
    const importe$ = this.form.get('importe').valueChanges;
    merge(tipo$, base$, descuento$, importe$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.actualizar());
  }

  addFacturas(facturas: CuentaPorCobrar[]) {
    facturas.forEach(cxc => {
      const det = buildNotaDet(cxc);
      const found = this.partidasData.find(
        item => item.cuentaPorCobrar.id === cxc.id
      );
      if (!found) {
        this.partidas.push(new FormControl(det));
      }
    });
    this.actualizar();
  }

  onDelete(event: { index: number; row: Partial<NotaDeCreditoDet> }) {
    if (this.bonificacion.cfdi) {
      return;
    }
    this.dialogService
      .openConfirm({
        title: 'Eliminar concepto',
        message: `Seguro que desea eliminar el concepto por $ ${
          event.row.importe
        }`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR',
        width: '550px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.partidas.removeAt(event.index);
          this.form.markAsDirty();
          this.cd.detectChanges();
        }
      });
  }

  submit() {
    if (this.form.valid) {
      const res = { ...this.form.value, partidas: this.partidasData };
      const update = { id: this.bonificacion.id, changes: res };
      this.save.emit(update);
    }
  }

  get partidasData(): Partial<NotaDeCreditoDet>[] {
    return this.partidas.value;
  }

  get partidas(): FormArray {
    return this.form.get('partidas') as FormArray;
  }

  actualizar() {
    const calculo: string = this.form.get('tipoDeCalculo').value;
    if (calculo === 'PORCENTAJE') {
      this.calcularPorPorcentaje();
    } else {
      this.calcularPorProrrateo();
    }

    this.form.markAsDirty();
    this.cd.detectChanges();
  }

  private calcularPorPorcentaje() {
    console.log('Calculando por PORCENTAJE');
    const descuento = this.form.get('descuento').value || 0.0;
    const tipo = this.form.get('baseDelCalculo').value || 'SALDO';
    for (const control of this.partidas.controls) {
      const det: Partial<NotaDeCreditoDet> = control.value;
      const base: number =
        tipo === 'SALDO' ? det.saldoDocumento : det.totalDocumento;
      const total = base * (descuento / 100);
      const importe = _.round(total / 1.16, 2);
      const impuesto = _.round(importe * 0.16, 2);
      det.base = importe;
      det.impuesto = impuesto;
      det.importe = importe + impuesto;
      control.setValue(det);
    }
  }

  private calcularPorProrrateo() {
    console.log('Calculando por PRORRATEO');
    const tipo = this.form.get('baseDelCalculo').value || 'SALDO';
    const importe = this.form.get('importe').value as number;
    const sobreSaldo = tipo === 'SALDO';
    const base = _.sumBy(
      this.partidasData,
      sobreSaldo ? 'saldoDocumento' : 'totalDocumento'
    );

    for (const control of this.partidas.controls) {
      const det: Partial<NotaDeCreditoDet> = control.value;
      const monto = sobreSaldo ? det.saldoDocumento : det.totalDocumento;
      const prorrateo = monto / base;
      const asignado = _.round(importe * prorrateo, 2);
      det.importe = asignado;
      control.setValue(det);
    }
  }
}
