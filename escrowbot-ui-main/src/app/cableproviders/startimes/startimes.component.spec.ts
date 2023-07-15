import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartimesComponent } from './startimes.component';

describe('StartimesComponent', () => {
  let component: StartimesComponent;
  let fixture: ComponentFixture<StartimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartimesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
