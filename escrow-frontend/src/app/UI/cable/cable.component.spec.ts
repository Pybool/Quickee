import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CableComponent } from './cable.component';

describe('CableComponent', () => {
  let component: CableComponent;
  let fixture: ComponentFixture<CableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CableComponent]
    });
    fixture = TestBed.createComponent(CableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
