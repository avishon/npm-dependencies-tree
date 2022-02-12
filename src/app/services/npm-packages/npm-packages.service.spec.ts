import { TestBed } from '@angular/core/testing';

import { NpmPackagesService } from './npm-packages.service';

describe('NpmPackagesService', () => {
  let service: NpmPackagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NpmPackagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
