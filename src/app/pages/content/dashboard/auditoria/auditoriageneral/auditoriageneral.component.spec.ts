import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriageneralComponent } from './auditoriageneral.component';

describe('AuditoriageneralComponent', () => {
  let component: AuditoriageneralComponent;
  let fixture: ComponentFixture<AuditoriageneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriageneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriageneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
