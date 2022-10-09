import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONTEXT } from '../commons/constants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
  ) { }

  public get<T>(uri: string): Observable<T> {
    return this.http.get<T>(`${API_CONTEXT}${uri}`);
  }
}
