import { TestBed } from '@angular/core/testing';

import { PanelNotificacionesService } from './panel-notificaciones.service';

describe('PanelNotificacionesService', () => {
  let service: PanelNotificacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelNotificacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
