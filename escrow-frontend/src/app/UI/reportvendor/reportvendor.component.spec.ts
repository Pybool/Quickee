import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportvendorComponent } from './reportvendor.component';

describe('ReportvendorComponent', () => {
  let component: ReportvendorComponent;
  let fixture: ComponentFixture<ReportvendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportvendorComponent]
    });
    fixture = TestBed.createComponent(ReportvendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
