import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NavigationService } from '../services/navigation.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(
    private navigationService: NavigationService,
    private authService: AuthService
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.navigationService.navigate(['/login']);
        } else if (error.status === 403 && request.method == 'GET') {
          this.navigationService.navigate(['/page-not-accessible']);
        } else if (error.status === 404 && request.method == 'GET') {
          this.navigationService.navigate(['/page-not-found']);
        }

        return throwError(() => error);
      })
    );
  }
}
