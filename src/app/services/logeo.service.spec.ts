import { TestBed } from '@angular/core/testing';

import { LogeoService } from './logeo.service';

describe('LogeoService', () => {
  let service: LogeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
