import { Component, OnInit } from '@angular/core';
import { SessaoUsuario } from './models/usuario';
import { AppStateService } from './services/app-state.service';
import { SessaoUsuarioService } from './services/sessao-usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-app';
  sessaoUsuario: SessaoUsuario | null = null;

  constructor(
    private sessaoUsuarioService: SessaoUsuarioService,
    private appState: AppStateService,
  ) { }

  ngOnInit(): void {
    this.sessaoUsuarioService.getUsuarioInfo().subscribe(sessaoUsuario => {
      this.sessaoUsuario = sessaoUsuario;
      this.appState.changeSessaoUsuario(sessaoUsuario);
    });
  }

  get isUsuarioLoaded() {
    return this.sessaoUsuario?.isLoaded;
  }
}
