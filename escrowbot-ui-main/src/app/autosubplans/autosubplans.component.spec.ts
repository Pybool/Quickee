import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutosubplansComponent } from './autosubplans.component';

describe('AutosubplansComponent', () => {
  let component: AutosubplansComponent;
  let fixture: ComponentFixture<AutosubplansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutosubplansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutosubplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
