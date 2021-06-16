import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfasesComponent } from './interfases.component';

describe('InterfasesComponent', () => {
  let component: InterfasesComponent;
  let fixture: ComponentFixture<InterfasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
