import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorpaymentpinComponent } from './vendorpaymentpin.component';

describe('VendorpaymentpinComponent', () => {
  let component: VendorpaymentpinComponent;
  let fixture: ComponentFixture<VendorpaymentpinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorpaymentpinComponent]
    });
    fixture = TestBed.createComponent(VendorpaymentpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
