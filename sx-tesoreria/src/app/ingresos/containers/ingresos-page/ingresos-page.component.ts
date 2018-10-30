import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';

@Component({
  selector: 'sx-ingresos-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ingresos-page.component.html',
  styles: [
    `
      .document {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class IngresosPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'cobros',
      title: 'Cobros',
      description: 'Registro de cobros',
      icon: 'attach_money'
    },
    {
      route: 'fichas',
      title: 'Fichas',
      description: 'Alta de fichas',
      icon: 'filter_none'
    },
    {
      route: 'fichasContado',
      title: 'Fichas (CON)',
      description: 'Fichas de  contado',
      icon: 'my_library_books'
    },
    {
      route: 'chequesdevueltos',
      title: 'Cheques DEV',
      description: 'Cheques devueltos',
      icon: 'settings_backup_restore'
    }
  ];

  loading$: Observable<boolean>;

  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
