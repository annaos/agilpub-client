import { TestBed } from '@angular/core/testing';

import { DocumentVersionService } from './document-version.service';

describe('DocumentVersionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentVersionService = TestBed.get(DocumentVersionService);
    expect(service).toBeTruthy();
  });
});
