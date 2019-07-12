import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { NotaDeCredito } from 'app/cobranza/models';

@Component({
  selector: 'sx-nota-header',
  templateUrl: './nota-header.component.html',
  styleUrls: ['./nota-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotaHeaderComponent implements OnInit {
  @Input() nota: NotaDeCredito;

  constructor() {}

  ngOnInit() {}
}
