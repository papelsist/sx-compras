import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonificacionesComponent } from './bonificaciones.component';

describe('BonificacionesComponent', () => {
  let component: BonificacionesComponent;
  let fixture: ComponentFixture<BonificacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonificacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
