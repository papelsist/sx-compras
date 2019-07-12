import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonificacionFormPartidasComponent } from './bonificacion-form-partidas.component';

describe('BonificacionFormPartidasComponent', () => {
  let component: BonificacionFormPartidasComponent;
  let fixture: ComponentFixture<BonificacionFormPartidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonificacionFormPartidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonificacionFormPartidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
