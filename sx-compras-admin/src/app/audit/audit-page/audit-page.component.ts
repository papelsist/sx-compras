import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Periodo } from 'app/_core/models/periodo';
import { Observable } from 'rxjs';
import { AuditService } from '../services/audit.service';
import { TdLoadingService } from '@covalent/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'sx-audit-page',
  templateUrl: './audit-page.component.html',
  styleUrls: ['./audit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditPageComponent implements OnInit {
  periodo = Periodo.fromNow(1);
  rows$: Observable<any[]>;

  constructor(
    private service: AuditService,
    private loadingService: TdLoadingService
  ) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loadingService.register('procesando');
    this.rows$ = this.service
      .list(this.periodo)
      .pipe(finalize(() => this.loadingService.resolve('procesando')));
  }

  onPeriodoChange(event: Periodo) {
    this.periodo = event;
    this.reload();
  }
}
