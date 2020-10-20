import { TestBed } from '@angular/core/testing';

import { ShopserviceService } from './shopservice.service';

describe('ShopserviceService', () => {
  let service: ShopserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
