import { TestBed } from '@angular/core/testing';

import { SessaoUsuarioService } from './sessao-usuario.service';

describe('SessaoUsuarioService', () => {
  let service: SessaoUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessaoUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
