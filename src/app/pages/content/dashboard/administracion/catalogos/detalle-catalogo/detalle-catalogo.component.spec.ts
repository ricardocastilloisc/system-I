import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCatalogoComponent } from './detalle-catalogo.component';

describe('DetalleCatalogoComponent', () => {
  let component: DetalleCatalogoComponent;
  let fixture: ComponentFixture<DetalleCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleCatalogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
