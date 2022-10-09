import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { SessaoUsuarioService } from 'src/app/services/sessao-usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private appState: AppStateService,
    private sessaoUsuarioService: SessaoUsuarioService,
  ) { }

  ngOnInit(): void {
    this.appState.sessaoUsuario.pipe(take(1)).subscribe(sessao => {
      if (sessao.isAutenticado) {
        this.router.navigate(['home'], { replaceUrl: true });
      }
    });
  }

  clickLogin() {

  }
}
