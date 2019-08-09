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
      route: 'existencias',
      title: 'Existencias',
      description: 'Existencias de productos',
      icon: 'format_list_numbered'
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