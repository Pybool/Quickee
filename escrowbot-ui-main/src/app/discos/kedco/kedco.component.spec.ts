import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KedcoComponent } from './kedco.component';

describe('KedcoComponent', () => {
  let component: KedcoComponent;
  let fixture: ComponentFixture<KedcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KedcoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KedcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
