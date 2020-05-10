import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UitvoerComponent } from './uitvoer.component';

describe('UitvoerComponent', () => {
  let component: UitvoerComponent;
  let fixture: ComponentFixture<UitvoerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UitvoerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UitvoerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
