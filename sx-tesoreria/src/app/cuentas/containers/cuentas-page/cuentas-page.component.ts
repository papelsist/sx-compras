import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';

@Component({
  selector: 'sx-cuentas-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cuentas-page.component.html'
})
export class CuentasPageComponent implements OnInit {
  constructor(public media: TdMediaService) {}

  ngOnInit() {}
}
