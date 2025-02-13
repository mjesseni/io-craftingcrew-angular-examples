import { TestBed } from '@angular/core/testing';

import { TranslationLoaderService } from './translation-loader.service';
import { provideHttpClient } from '@angular/common/http';

describe('TranslationLoaderService', () => {
  let service: TranslationLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient()
      ]
    });
    service = TestBed.inject(TranslationLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
