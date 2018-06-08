import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';



import { OrdenesService } from '../../services';

@Injectable()
export class OrdenResolver implements Resolve<Observable<any>> {
  constructor(private service: OrdenesService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.service.get(route.paramMap.get('id'));
  }
}
