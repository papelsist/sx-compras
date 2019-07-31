import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';

@Component({
  selector: 'sx-catalogos-page',
  templateUrl: './catalogos-page.component.html',
  styleUrls: ['./catalogos-page.component.scss']
})
export class CatalogosPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'productos',
      title: 'Productos',
      description: 'Catálogo de productos',
      icon: 'layers'
    },
    {
      route: 'lineas',
      title: 'Líneas',
      description: 'Líneas',
      icon: 'swap_horiz'
    },
    {
      route: 'marcas',
      title: 'Marcas',
      description: 'Marcas',
      icon: 'swap_horiz'
    },
    {
      route: 'clases',
      title: 'Clases',
      description: 'Clases de productos',
      icon: 'swap_horiz'
    },
    {
      route: 'listas',
      title: 'Precios',
      description: 'Cambios de precio',
      icon: 'transform'
    }
  ];

  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
