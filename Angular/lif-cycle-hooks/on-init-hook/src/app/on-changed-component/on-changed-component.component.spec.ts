import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnChangedComponentComponent } from './on-changed-component.component';

describe('OnChangedComponentComponent', () => {
  let component: OnChangedComponentComponent;
  let fixture: ComponentFixture<OnChangedComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnChangedComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnChangedComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
