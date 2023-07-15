import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GotvComponent } from './gotv.component';

describe('GotvComponent', () => {
  let component: GotvComponent;
  let fixture: ComponentFixture<GotvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GotvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GotvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
