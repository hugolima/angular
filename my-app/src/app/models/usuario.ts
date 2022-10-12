export class SessaoUsuario {
  private loaded = false;
  private autenticado = false;
  private sessaoUsuarioInfo: UsuarioInfo | null = null;

  constructor(sessaoInfo: UsuarioInfo | null, loaded = false) {
    this.loaded = loaded;
    if (sessaoInfo) {
      this.sessaoUsuarioInfo = sessaoInfo;
      this.autenticado = true;
    }
  }

  public get isLoaded() {
    return this.loaded;
  }

  public get isAutenticado() {
    return this.autenticado;
  }

  public get cpfCnpj() {
    return this.sessaoUsuarioInfo?.cpfCnpj;
  }

  public get nome() {
    return this.sessaoUsuarioInfo?.nome;
  }
}

export interface UsuarioInfo {
  cpfCnpj: string;
  nome: string;
}