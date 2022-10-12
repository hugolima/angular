import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, take } from 'rxjs';
import { AppError } from 'src/app/models/app-error';
import { SessaoUsuario, UsuarioInfo } from 'src/app/models/usuario';
import { AppStateService } from 'src/app/services/app-state.service';
import { SessaoUsuarioService } from 'src/app/services/sessao-usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  cpfCnpj =  new FormControl('', Validators.required);
  senha =  new FormControl('', Validators.required);

  mensagem = '';

  constructor(
    private router: Router,
    private appState: AppStateService,
    private sessaoUsuarioService: SessaoUsuarioService,
  ) { }

  ngOnInit(): void {
    this.appState.sessaoUsuario.pipe(take(1)).subscribe(sessao => {
      if (sessao.isAutenticado) {
        this.router.navigate(['home']);
      }
    });
  }

  onInputKeydown() {
    this.mensagem = '';
  }

  clickLogin() {
    if (!this.cpfCnpj.valid || !this.senha.valid) {
      this.mensagem = 'Preencha todos os campos';
      return;
    }
    this.sessaoUsuarioService.login(this.cpfCnpj.value!, this.senha.value!).pipe(
      catchError((e: AppError) => {
        this.mensagem = e.content.message;
        throw e;
      })
    ).subscribe((usrInfo: UsuarioInfo[]) => {
      const usuarioSessao = new SessaoUsuario(usrInfo[0], true);
      this.appState.changeSessaoUsuario(usuarioSessao);
      this.router.navigate([''])
    });
  }
}
