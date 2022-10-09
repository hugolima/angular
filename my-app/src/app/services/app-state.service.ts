import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessaoUsuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  sessaoUsuario!: Observable<SessaoUsuario>;

  private sessaoUsuarioBehavior = new BehaviorSubject<SessaoUsuario>(new SessaoUsuario(null));

  constructor() {
    this.sessaoUsuario = this.sessaoUsuarioBehavior.asObservable();
  }

  changeSessaoUsuario(sessaoUsuario: SessaoUsuario) {
    this.sessaoUsuarioBehavior.next(sessaoUsuario);
  }
}
