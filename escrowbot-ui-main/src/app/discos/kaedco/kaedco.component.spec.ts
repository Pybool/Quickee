import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaedcoComponent } from './kaedco.component';

describe('KaedcoComponent', () => {
  let component: KaedcoComponent;
  let fixture: ComponentFixture<KaedcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaedcoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaedcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
