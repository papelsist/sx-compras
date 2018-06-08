import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { OrdenesService } from '../../services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sx-orden-de-compra',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay" >
    <div >
      <sx-orden-form [orden]="orden"  (save)="onSave($event)" >
      </sx-orden-form>
    </div>
  </ng-template>
  `
})
export class OrdenDeCompraComponent implements OnInit {
  orden: any;
  productos: any[];
  loading$ = new BehaviorSubject(false);

  constructor(private service: OrdenesService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.orden = this.route.snapshot.data.orden;
    console.log('OC: ', this.orden);
  }

  onSave(orden) {
    console.log('Salvando compra: ', orden);
    this.loading$.next(true);
    this.service
      .save(orden)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe(compra => {
        console.log('Compra salvada: ', compra);
      });
  }
}
