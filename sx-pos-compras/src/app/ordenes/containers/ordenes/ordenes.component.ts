import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';

@Component({
  selector: 'sx-ordenes',
  templateUrl: './ordenes.component.html'
})
export class OrdenesComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'pendientes',
      title: 'Pendientes',
      description: 'Alta de ordenes',
      icon: 'repeat'
    },
    {
      route: 'transito',
      title: 'Transito',
      description: 'Ordenes en tránsito',
      icon: 'swap_horiz'
    },
    {
      route: 'atendidas',
      title: 'Atendidas',
      descripcion: 'Ordenes atendidas',
      icon: 'cancel'
    }
  ];
  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
