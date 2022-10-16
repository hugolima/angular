import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AppError } from '../models/app-error';
import { SessaoUsuario, UsuarioInfo } from '../models/usuario';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SessaoUsuarioService {

  constructor(
    private httpService: HttpService,
  ) { }

  public login(id: string, senha: string): Observable<any> {
    return this.httpService.get(`/clientes?cpf=${id}&senha=${senha}`)
  }

  public getUsuarioInfo(): Observable<SessaoUsuario> {
    return this.httpService.get<UsuarioInfo>('/sessao-usuario').pipe(
      map(usrInfo => new SessaoUsuario(usrInfo, true)),
      catchError((error: AppError) => {
        if (error.status === 404) {
          //return of(new SessaoUsuario({ "cpfCnpj": "11111111111", "nome": "Fulano de Tal" }, true))
          return of(new SessaoUsuario(null, true))
        }
        throw error;
      })
    );
  }
}
