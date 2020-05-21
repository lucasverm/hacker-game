import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificaatComponent } from './certificaat.component';

describe('CertificaatComponent', () => {
  let component: CertificaatComponent;
  let fixture: ComponentFixture<CertificaatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificaatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificaatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
