import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonificacionesTableComponent } from './bonificaciones-table.component';

describe('BonificacionesTableComponent', () => {
  let component: BonificacionesTableComponent;
  let fixture: ComponentFixture<BonificacionesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonificacionesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonificacionesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
