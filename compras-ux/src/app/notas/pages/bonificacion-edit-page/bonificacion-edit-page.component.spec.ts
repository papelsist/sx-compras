import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonificacionEditPageComponent } from './bonificacion-edit-page.component';

describe('BonificacionEditPageComponent', () => {
  let component: BonificacionEditPageComponent;
  let fixture: ComponentFixture<BonificacionEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonificacionEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonificacionEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
