import { TestBed } from '@angular/core/testing';

import { InterfasesService } from './interfases.service';

describe('InterfasesService', () => {
  let service: InterfasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterfasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
