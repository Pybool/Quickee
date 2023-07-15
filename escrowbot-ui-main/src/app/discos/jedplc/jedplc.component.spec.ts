import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JedplcComponent } from './jedplc.component';

describe('JedplcComponent', () => {
  let component: JedplcComponent;
  let fixture: ComponentFixture<JedplcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JedplcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JedplcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
