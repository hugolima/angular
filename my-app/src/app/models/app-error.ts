export class AppError extends Error {
  private statusResponse: number;
  private contentError: AppErrorContent;

  constructor(code: number, content: AppErrorContent) {
    super('' + code);
    this.statusResponse = code;
    this.contentError = content;
  }

  public get status(): number {
    return this.statusResponse;
  }

  public get content(): AppErrorContent {
    return { ...this.contentError };
  }
}

export interface AppErrorContent {
  code: string;
  message: string;
}
