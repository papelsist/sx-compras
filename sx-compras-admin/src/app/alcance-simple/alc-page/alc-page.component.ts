import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';

import { AlcanceSimpleService } from '../services/alcance-simple.service';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'sx-alc-page',
  templateUrl: './alc-page.component.html',
  styleUrls: ['./alc-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlcPageComponent implements OnInit {
  rows$: Observable<any[]>;
  meses = 2;

  constructor(
    private service: AlcanceSimpleService,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {}

  onReload() {
    this.loadingService.register('alcanceLoading');
    this.rows$ = this.service
      .crossTab(this.meses)
      .pipe(finalize(() => this.loadingService.resolve('alcanceLoading')));
    // this.rows$.subscribe(r => console.log(r));
  }

  changeMeses() {
    this.dialogService
      .openPrompt({
        message: 'Meses de alcance: ',
        title: 'Alcance simple',
        acceptButton: 'ACEPTAR',
        cancelButton: 'CANCELAR',
        value: this.meses.toString()
      })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.meses = data;
          this.onReload();
        }
      });
  }

  onSelect(event: any) {}
}
