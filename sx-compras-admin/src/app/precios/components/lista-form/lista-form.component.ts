import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import * as _ from 'lodash';

import {
  ListaDePreciosVenta,
  ListaDePreciosVentaDet,
  createPartida
} from 'app/precios/models';

import { ProductoUtilsService } from 'app/productos/services/productos-utils.service';
import { ListadetTableComponent } from '../listadet-table/listadet-table.component';

@Component({
  selector: 'sx-lista-form',
  templateUrl: './lista-form.component.html',
  styleUrls: ['./lista-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaFormComponent implements OnInit {
  form: FormGroup;
  @Input() lista: Partial<ListaDePreciosVenta>;
  _disponibles: any[];
  dictionaty: { [id: string]: any } = {};

  @Output() save = new EventEmitter<Partial<ListaDePreciosVenta>>();
  partidas: Partial<ListaDePreciosVentaDet>[] = [];
  @ViewChild('partidasTable') grid: ListadetTableComponent;

  constructor(private fb: FormBuilder, private service: ProductoUtilsService) {
    this.buildForm();
  }

  ngOnInit() {}

  private buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      inicio: [null, [Validators.required]],
      descripcion: [null, Validators.required],
      linea: ['TODAS', Validators.required],
      moneda: ['MXN', Validators.required],
      tipoDeCambio: [1.0, Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      const res = {
        ...this.form.value
      };
      this.save.emit(res);
    }
  }

  isValid() {
    return this.form.valid;
  }

  agregarProductos() {
    this.selectProductos(this._disponibles);
  }

  private selectProductos(productos: any[]) {
    this.service
      .showSelector(productos)
      .afterClosed()
      .subscribe((selection: any[]) => {
        if (selection) {
          const newData = [];
          selection.forEach(item => {
            const det = createPartida(item);
            newData.push(det);
          });
          const items = [...newData, ...this.partidas];
          this.partidas = items;
          // this.grid.partidas = items;
          this.grid.gridApi.setRowData(items);
        }
      });
  }

  @Input()
  set disponibles(rows: any[]) {
    this._disponibles = rows;
    this.dictionaty = _.keyBy(rows, 'clave');
  }
}
