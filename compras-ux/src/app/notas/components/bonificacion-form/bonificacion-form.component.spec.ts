import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonificacionFormComponent } from './bonificacion-form.component';

describe('BonificacionFormComponent', () => {
  let component: BonificacionFormComponent;
  let fixture: ComponentFixture<BonificacionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonificacionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonificacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
