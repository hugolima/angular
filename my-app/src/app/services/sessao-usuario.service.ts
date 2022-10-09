import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SessaoUsuario, UsuarioInfo } from '../models/usuario';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SessaoUsuarioService {

  constructor(
    private httpService: HttpService,
  ) { }

  public login(id: string, senha: string): Observable<SessaoUsuario> | null {
    // TODO:
    return null;
  }

  public getUsuarioInfo(): Observable<SessaoUsuario> {
    return this.httpService.get<UsuarioInfo>('/sessao-usuario').pipe(
      map(usrInfo => new SessaoUsuario(usrInfo, true))
    );
  }
}
