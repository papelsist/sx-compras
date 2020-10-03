import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TdMediaService } from '@covalent/core';

@Component({
  selector: 'sx-inventarios-page',
  templateUrl: './inventarios-page.component.html',
  styleUrls: ['./inventarios-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventariosPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'ventas',
      title: 'Ventas',
      description: 'Resumen de ventas',
      icon: 'shopping_cart'
    },
    {
      route: 'existencias',
      title: 'Existencias',
      description: 'Existencias de productos',
      icon: 'format_list_numbered'
    },
    {
      route: 'alcance-simple',
      title: 'Alcance S',
      description: 'Alcance simple',
      icon: 'tune'
    },
    {
      route: 'audit',
      title: 'Replica',
      description: 'Bitácora de replicación',
      icon: 'settings_input_antenna'
    }
  ];

  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
