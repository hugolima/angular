import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { SessaoUsuario } from 'src/app/models/usuario';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sessaoUsuario!: SessaoUsuario;

  constructor(
    private router: Router,
    private appState: AppStateService,
  ) { }

  ngOnInit(): void {
    this.appState.sessaoUsuario.pipe(take(1)).subscribe(sessao => {
      this.sessaoUsuario = sessao;
      if (!sessao.isAutenticado) {
        this.router.navigate(['login']);
      }
    });
  }
}
