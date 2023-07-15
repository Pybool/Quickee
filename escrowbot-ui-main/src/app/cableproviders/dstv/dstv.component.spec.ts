import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DstvComponent } from './dstv.component';

describe('DstvComponent', () => {
  let component: DstvComponent;
  let fixture: ComponentFixture<DstvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DstvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DstvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
