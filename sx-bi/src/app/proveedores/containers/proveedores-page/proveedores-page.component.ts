import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';

@Component({
  selector: 'sx-proveedores-page',
  templateUrl: './proveedores-page.component.html',
  styleUrls: ['./proveedores-page.component.scss']
})
export class ProveedoresPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: '',
      title: 'Proveedores',
      description: 'Catálogo de proveedores',
      icon: 'people'
    }
  ];

  reportes: Object[] = [];

  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
