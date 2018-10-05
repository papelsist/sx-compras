import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';

@Component({
  selector: 'sx-ordenes-page',
  templateUrl: './ordenes-page.component.html'
})
export class OrdenesPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'compras',
      title: 'Compras',
      description: 'Ordenes de compra',
      icon: 'add_shopping_cart'
    },
    {
      route: 'recepciones',
      title: 'Recepciones',
      description: 'Ordenes en tránsito',
      icon: 'flight_land'
    },
    {
      route: 'alcance',
      title: 'Alcances',
      descripcion: 'Alcancees de inventario',
      icon: 'data_usage'
    }
  ];

  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
