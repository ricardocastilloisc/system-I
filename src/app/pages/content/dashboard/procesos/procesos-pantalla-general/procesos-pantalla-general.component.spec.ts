import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosPantallaGeneralComponent } from './procesos-pantalla-general.component';

describe('ProcesosPantallaGeneralComponent', () => {
  let component: ProcesosPantallaGeneralComponent;
  let fixture: ComponentFixture<ProcesosPantallaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosPantallaGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosPantallaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
