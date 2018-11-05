import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { CorteDeTarjeta } from '../../cortes-tarjeta/models/corteDeTarjeta';
import { CorteDeTarjetaService } from './corteDeTarjeta.service';

@Injectable()
export class CorteResolver implements Resolve<CorteDeTarjeta> {
  constructor(private service: CorteDeTarjetaService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CorteDeTarjeta> {
    return this.service.get(route.paramMap.get('id'));
  }
}
