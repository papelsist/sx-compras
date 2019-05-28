import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditoPageComponent } from './credito-page.component';

describe('CreditoPageComponent', () => {
  let component: CreditoPageComponent;
  let fixture: ComponentFixture<CreditoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
