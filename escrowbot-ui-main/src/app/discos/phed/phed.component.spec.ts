import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhedComponent } from './phed.component';

describe('PhedComponent', () => {
  let component: PhedComponent;
  let fixture: ComponentFixture<PhedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
