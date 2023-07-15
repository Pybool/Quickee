import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EkedcComponent } from './ekedc.component';

describe('EkedcComponent', () => {
  let component: EkedcComponent;
  let fixture: ComponentFixture<EkedcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EkedcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EkedcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
