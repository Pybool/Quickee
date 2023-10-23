import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantorderlistComponent } from './merchantorderlist.component';

describe('MerchantorderlistComponent', () => {
  let component: MerchantorderlistComponent;
  let fixture: ComponentFixture<MerchantorderlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MerchantorderlistComponent]
    });
    fixture = TestBed.createComponent(MerchantorderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
