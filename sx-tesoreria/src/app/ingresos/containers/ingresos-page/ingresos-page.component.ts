import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';

@Component({
  selector: 'sx-ingresos-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ingresos-page.component.html'
})
export class IngresosPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      path: 'cobros',
      title: 'Cobros',
      description: 'Registro de cobros',
      icon: 'attach_money'
    },
    {
      path: 'fichas',
      title: 'Fichas',
      description: 'Alta de fichas',
      icon: 'filter_none'
    },
    {
      path: 'fichasContado',
      title: 'Fichas (CON)',
      description: 'Fichas de  contado',
      icon: 'my_library_books'
    },
    {
      path: 'chequesDevueltos',
      title: 'Cheques DEV',
      description: 'Cheques devueltos',
      icon: 'settings_backup_restore'
    }
  ];

  loading$: Observable<boolean>;

  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
