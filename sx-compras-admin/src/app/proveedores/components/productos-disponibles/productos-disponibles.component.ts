import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Producto } from '../../../productos/models/producto';

@Component({
  selector: 'sx-productos-disponibles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './productos-disponibles.component.html',
  styleUrls: ['./productos-diponibles.component.scss']
})
export class ProductosDisponiblesComponent implements OnInit {
  productos: Producto[] = [];
  selected: Producto[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.productos = data.productos;
    this.selected = data.selected || undefined;
  }

  ngOnInit() {}

  onSelection(event: Producto[]) {
    this.selected = event;
  }

  onSearch(event) {
    console.log('Search: ', event);
  }
}
