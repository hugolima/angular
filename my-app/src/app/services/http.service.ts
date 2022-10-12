import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { API_CONTEXT } from '../commons/constants';
import { AppError, AppErrorContent } from '../models/app-error';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
  ) { }

  public get<T>(uri: string): Observable<T> {
    return this.http.get<T>(`${API_CONTEXT}${uri}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          throw new AppError(error.status, { code: "404", message: 'Recurso não encontrado' });
        }
        const appError = error.error[0] as AppErrorContent;
        throw new AppError(error.status, appError);
      })
    );
  }

  public post(uri: string, body: any): Observable<any> {
    return this.http.post(`${API_CONTEXT}${uri}`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        const appError = error.error[0] as AppErrorContent;
        throw new AppError(error.status, appError);
      })
    )
  }
}
