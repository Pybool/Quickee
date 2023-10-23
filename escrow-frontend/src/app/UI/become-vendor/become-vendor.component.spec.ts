import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeVendorComponent } from './become-vendor.component';

describe('BecomeVendorComponent', () => {
  let component: BecomeVendorComponent;
  let fixture: ComponentFixture<BecomeVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BecomeVendorComponent]
    });
    fixture = TestBed.createComponent(BecomeVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
