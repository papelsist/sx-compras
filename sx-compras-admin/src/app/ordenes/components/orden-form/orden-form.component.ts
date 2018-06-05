import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormControl
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDialog, MatTable } from '@angular/material';

import * as moment from 'moment';

import { OrdenDetFormComponent } from '../orden-det-form/orden-det-form.component';
import { OrdenFormTableComponent } from '../orden-form-table/orden-form-partidas.component';

@Component({
  selector: 'sx-orden-form',
  templateUrl: './orden-form.component.html',
  styleUrls: ['./orden-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdenFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() orden: any;
  partidas: any[] = [];

  form: FormGroup;
  destroy$ = new Subject<boolean>();

  @Output() save = new EventEmitter();
  @Output() proveedorChange = new EventEmitter();

  @ViewChild('table') table: OrdenFormTableComponent;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('On Change... ', changes);
  }

  ngOnInit() {
    this.buildForm();
    if (this.orden) {
      this.form.patchValue(this.orden);
      this.form.get('proveedor').disable();
      this.partidas = this.orden.partidas;
      console.log('Partidas: ', this.orden.partidas);
    }
    this.onProveedor();
  }

  private onProveedor() {
    this.form
      .get('proveedor')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => this.proveedorChange.emit(val));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [moment().toISOString(), Validators.required],
      proveedor: [null, Validators.required],
      comentario: [null]
    });
  }

  onSubmit() {
    this.save.emit(this.prepareEntity());
  }

  private prepareEntity() {
    const entity = {
      ...this.form.value,
      proveedor: { id: this.proveedor.id },
      partidas: this.partidas
    };
    return entity;
  }

  onInsert() {
    this.dialog
      .open(OrdenDetFormComponent, {
        height: '350px',
        width: '650px',
        data: {
          proveedor: this.form.get('proveedor').value
        }
      })
      .afterClosed()
      .subscribe(partida => {
        if (partida) {
          const det = {
            producto: partida.producto.producto,
            solicitado: partida.cantidad,
            precio: partida.producto.precio,
            comentario: partida.comentario
          };
          this.partidas.push(det);
          this.table.reload();
        }
      });
  }

  get proveedor() {
    return this.form.get('proveedor').value;
  }
}
