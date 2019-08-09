import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Periodo } from 'app/_core/models/periodo';
import { Observable } from 'rxjs';
import { AuditService } from '../services/audit.service';

@Component({
  selector: 'sx-audit-page',
  templateUrl: './audit-page.component.html',
  styleUrls: ['./audit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditPageComponent implements OnInit {
  periodo = Periodo.fromNow(1);
  rows$: Observable<any[]>;

  constructor(private service: AuditService) {}

  ngOnInit() {
    this.rows$ = this.service.list();
  }
}
