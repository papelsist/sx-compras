import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';

@Component({
  selector: 'sx-ordenes-page',
  templateUrl: './ordenes-page.component.html'
})
export class OrdenesPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'requisiciones',
      title: 'Requisiciones',
      description: 'Req de Material',
      icon: 'border_color'
    },
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
      route: 'alcances',
      title: 'Alcances',
      descripcion: 'Alcancees de inventario',
      icon: 'data_usage'
    }
  ];

  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
