import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbedcComponent } from './ibedc.component';

describe('IbedcComponent', () => {
  let component: IbedcComponent;
  let fixture: ComponentFixture<IbedcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbedcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IbedcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
