import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlowdropdownComponent } from './glowdropdown.component';

describe('GlowdropdownComponent', () => {
  let component: GlowdropdownComponent;
  let fixture: ComponentFixture<GlowdropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlowdropdownComponent]
    });
    fixture = TestBed.createComponent(GlowdropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
