import { TestBed } from '@angular/core/testing';

import { GardenserviceService } from './gardenservice.service';

describe('GardenserviceService', () => {
  let service: GardenserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GardenserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
