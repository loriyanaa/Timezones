import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

import { HttpClientService } from './http-client.service';
import { ApiPaths } from './../constants/api-paths.constants';
import { AppConstants } from './../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpService: HttpClientService,
    private cookieService: CookieService
  ) { }

  public get userRole(): string {
    const token = this.getToken();
    if (!token) {
      return;
    }

    const helper = new JwtHelperService();
    const role = helper.decodeToken(token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return role;
  }

  public get userId(): number {
    const token = this.getToken();
    if (!token) {
      return;
    }

    const helper = new JwtHelperService();
    const userId = +helper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    return userId;
  }

  public get userEmail(): string {
    const token = this.getToken();
    if (!token) {
      return;
    }

    const helper = new JwtHelperService();
    const userEmail = helper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

    return userEmail;
  }

  public login(email: string, password: string): Observable<string> {
    return this.httpService.post(
      ApiPaths.loginUrl, 
      {
        email,
        password
      }
    );
  }

  public logout(): void {
    this.cookieService.delete(AppConstants.accessTokenCookieName, '/')
  }

  public register(email: string, password: string): Observable<void> {
    return this.httpService.post(
      ApiPaths.registerUrl, 
      {
        email,
        password
      }
    );
  }

  public getToken(): string {
    return this.cookieService.get(AppConstants.accessTokenCookieName);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);

    return !isExpired;
  }

  public mustChangePassword(token: string): boolean {
    if (!token) {
      return false;
    }

    const helper = new JwtHelperService();
    const mustChangePassword = helper.decodeToken(token)['mustchangepassword'];

    return mustChangePassword;
  }

  public setAccessToken(token: string): void {
    const helper = new JwtHelperService();
    const expirationDate = helper.getTokenExpirationDate(token);

    this.cookieService.set(AppConstants.accessTokenCookieName, token, expirationDate, '/');
  }

  public changePassword(email: string, currentPassword: string, newPassword: string): Observable<unknown> {
    return this.httpService.put(
      ApiPaths.changePasswordUrl, 
      {
        email,
        currentPassword,
        newPassword
      }
    );
  }
}
