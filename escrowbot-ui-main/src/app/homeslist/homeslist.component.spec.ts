import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeslistComponent } from './homeslist.component';

describe('HomeslistComponent', () => {
  let component: HomeslistComponent;
  let fixture: ComponentFixture<HomeslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
