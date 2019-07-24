import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {
  RequisicionDeMaterial,
  RequisicionDeMaterialDet
} from 'app/requisiciones/models';

import { Update } from '@ngrx/entity';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductosSelectorService } from 'app/proveedores/productos-selector/productos-selector.service';
import { RequisicionPartidasComponent } from '../requisicion-partidas/requisicion-partidas.component';

@Component({
  selector: 'sx-requisicion-form',
  templateUrl: './requisicion-form.component.html',
  styleUrls: ['./requisicion-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequisicionFormComponent implements OnInit, OnChanges {
  _requisicion: RequisicionDeMaterial;
  partidas: Partial<RequisicionDeMaterialDet>[];
  partidas$ = new BehaviorSubject<Partial<RequisicionDeMaterialDet>[]>([]);

  form: FormGroup;

  @Input() disponibles: any[] = [];

  @Output() update = new EventEmitter<Update<RequisicionDeMaterial>>();
  @Output() cancel = new EventEmitter();

  @ViewChild('grid') grid: RequisicionPartidasComponent;

  constructor(
    private fb: FormBuilder,
    private selector: ProductosSelectorService
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.requisicion && changes.requisicion.currentValue) {
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      comentario: [null]
    });
  }

  agregarPartidas() {
    this.selector
      .opneSelection(this.disponibles)
      .afterClosed()
      .subscribe((selected: any[]) => {
        if (selected) {
          const rows: Partial<RequisicionDeMaterialDet>[] = selected.map(
            item => {
              return {
                producto: item.clave,
                descripcion: item.descripcion,
                unidad: item.unidad,
                solicitado: 0.0,
                comentario: ''
              };
            }
          );
          const res: Partial<RequisicionDeMaterialDet>[] = [
            ...this.partidas,
            ...rows
          ];
          this.partidas$.next(res);
          // this.grid.setRowData(this.partidas);
          // this.dirty$.next(true);
          this.form.markAsDirty();
        }
      });
  }

  @Input()
  set requisicion(data: RequisicionDeMaterial) {
    this._requisicion = data;
    this.partidas$.next(this._requisicion.partidas);
    this.form.patchValue(this.requisicion);
  }

  get requisicion(): RequisicionDeMaterial {
    return this._requisicion;
  }

  onEdit(row: any) {}

  onSave() {
    const changes = {
      partidas: this.grid.getAllRows()
    };
    const update: Update<RequisicionDeMaterial> = {
      id: this.requisicion.id,
      changes
    };
    this.update.next(update);
  }
}
