/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SoundService } from './sound.service';

describe('Service: Music', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoundService]
    });
  });

  it('should ...', inject([SoundService], (service: SoundService) => {
    expect(service).toBeTruthy();
  }));
});
