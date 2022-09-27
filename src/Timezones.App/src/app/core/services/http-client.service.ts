import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  constructor(private httpClient: HttpClient) { }

  public get<T>(url: string, params: { [key: string]: any } | null = null): Observable<T> {
    return this.httpClient.get<T>(url, { params });
  }

  public put<T>(url: string, body: any, options: { [key: string]: any } | null = null): Observable<T> {
    return this.httpClient.put<T>(url, body, options || {});
  }

  public post<T>(url: string, body?: any, options: { [key: string]: any } | null = null): Observable<T> {
    return this.httpClient.post<T>(url, body, options || {});
  }

  public patch<T>(url: string, body?: any, options: { [key: string]: any } | null = null): Observable<T> {
    return this.httpClient.patch<T>(url, body, options || {});
  }

  public delete<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(url);
  }
}
