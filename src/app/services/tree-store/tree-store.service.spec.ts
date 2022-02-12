import { TestBed } from '@angular/core/testing';

import { TreeStoreService } from './tree-store.service';

describe('TreeStoreService', () => {
  let service: TreeStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
