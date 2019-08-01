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

import {
  ListaDePreciosVenta,
  ListaDePreciosVentaDet,
  createPartida
} from 'app/precios/models';
import { Producto } from 'app/productos/models/producto';

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
  @Input() productos: { [id: string]: Producto } = {};
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
    /*
    if (!this.productos) {
      this.service.loadProductos().subscribe(res => {
        this.productos = res;
        this.selectProductos(this.productos);
      });
    } else {
      this.selectProductos(this.productos);
    }
    */
    this.selectProductos(this.getDisponibles());
  }

  private selectProductos(productos: any[]) {
    this.service
      .showSelector(productos)
      .afterClosed()
      .subscribe((selection: any[]) => {
        if (selection) {
          console.log('Agrgando partidas: ', selection);
          const newData = [];
          selection.forEach(item => {
            const det = createPartida(item);
            newData.push(det);
          });
          const items = [...newData, ...this.partidas];
          this.partidas = items;
          console.log('Partidas: ', this.partidas);
          this.grid.partidas = items;
        }
      });
  }

  private getDisponibles() {
    return Object.keys(this.productos).map(id => this.productos[id]);
  }
}
